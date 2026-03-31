package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
)

var downloadsOverTime = make(map[string]map[int64]int64)
var pluginInfos []Plugin

type Plugin struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	Author      string `json:"author"`
	Description string `json:"description"`
	Repo        string `json:"repo"`
	Downloads   int64  `json:"downloads"`
}

func main() {
	fmt.Println("Starting data crunching...")
	readPluginInfos("community-plugins.json")
	processData("stats.json")
	
	fmt.Println("Creating plugins directory...")
	err := os.MkdirAll("./plugins", 0700)
	if err != nil {
		panic(err)
	}

	totalPlugins := len(downloadsOverTime)
	fmt.Printf("Writing %d individual plugin files...\n", totalPlugins)
	count := 0
	for pluginName, pluginDownloads := range downloadsOverTime {
		path := "./plugins/" + pluginName + ".json"
		saveToJsonFile(path, pluginDownloads)
		count++
		if count%100 == 0 {
			fmt.Printf("Progress: %d/%d plugins written\n", count, totalPlugins)
		}
	}
	
	fmt.Println("Writing master plugins.json file...")
	saveToJsonFile("plugins.json", pluginInfos)
	fmt.Println("Data crunching completed successfully.")
}

func readPluginInfos(fileName string) {
	fmt.Printf("Reading plugin info from %s...\n", fileName)
	data, err := os.ReadFile(fileName)
	if err != nil {
		panic(err)
	}
	if err := json.Unmarshal(data, &pluginInfos); err != nil {
		panic(err)
	}
	fmt.Printf("Loaded info for %d plugins.\n", len(pluginInfos))
}

func saveToJsonFile[V any](fileName string, data V) {
	// Reduced noise for individual files, but keeping the error check
	file, err := json.MarshalIndent(data, "", "	")
	if err != nil {
		fmt.Printf("Error marshaling %s: %v\n", fileName, err)
		panic(err)
	}
	err = os.WriteFile(fileName, file, 0644)
	if err != nil {
		fmt.Printf("Error writing %s: %v\n", fileName, err)
		panic(err)
	}
}

func processData(fileName string) {
	fmt.Printf("Processing %s...\n", fileName)
	readFile, err := os.Open(fileName)
	if err != nil {
		panic(err)
	}
	defer readFile.Close()
	scan := bufio.NewScanner(readFile)
	const maxCapacity = 10 * 1024 * 1024 // 10MB
	buf := make([]byte, 64*1024)
	scan.Buffer(buf, maxCapacity)

	var jsonData strings.Builder
	doCopy := false
	var currentTimestamp int64
	blockCount := 0
	
	for scan.Scan() {
		line := scan.Text()
		if strings.HasPrefix(line, "---BEGIN") {
			currentTimestamp = parseTimestamp(line)
			doCopy = true
			jsonData.Reset()
			jsonData.Grow(512 * 1024)
		} else if strings.HasPrefix(line, "---END---") {
			if doCopy {
				parsePluginData(jsonData.String(), currentTimestamp)
				jsonData.Reset()
				doCopy = false
				blockCount++
				if blockCount%100 == 0 {
					fmt.Printf("Processed %d data blocks...\n", blockCount)
				}
			}
		} else if doCopy {
			jsonData.WriteString(line)
			jsonData.WriteByte('\n')
		}
	}

	if err := scan.Err(); err != nil {
		fmt.Printf("Scanner error: %v\n", err)
		panic(err)
	}
	fmt.Printf("Finished processing %d total data blocks.\n", blockCount)
}

type StatsEntry struct {
	Downloads int64 `json:"downloads"`
}

func parsePluginData(jsonStr string, timestamp int64) {
	if jsonStr == "" || timestamp == 0 {
		return
	}
	var data map[string]StatsEntry
	if err := json.Unmarshal([]byte(jsonStr), &data); err != nil {
		// If it's not a valid map of StatsEntry, ignore it. 
		// This happens if fast-export contains other JSON files.
		return
	}

	for name, entry := range data {
		downloads := entry.Downloads
		if plugin, ok := downloadsOverTime[name]; !ok {
			plugin = make(map[int64]int64)
			downloadsOverTime[name] = plugin
		}
		// Ignore 0 values for downloads if there were more downloads before
		if downloads == 0 && len(downloadsOverTime[name]) != 0 {
			hasPositive := false
			for _, prevDownloads := range downloadsOverTime[name] {
				if prevDownloads > 0 {
					hasPositive = true
					break
				}
			}
			if hasPositive {
				continue
			}
		}
		downloadsOverTime[name][timestamp] = downloads

		for i := range pluginInfos {
			if pluginInfos[i].Id == name && downloads > pluginInfos[i].Downloads {
				pluginInfos[i].Downloads = downloads
			}
		}
	}
}

func parseTimestamp(input string) int64 {
	// "author Obsidian Bot <admin@obsidian.md> 1672964166 +0000"
	rx := regexp.MustCompile(`\b(\d+)\b`)
	matches := rx.FindStringSubmatch(input)
	if len(matches) < 2 {
		return 0
	}
	timestamp, err := strconv.ParseInt(matches[1], 10, 64)
	if err != nil {
		return 0
	}
	return timestamp
}
