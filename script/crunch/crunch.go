package main

import (
	"bufio"
	"encoding/json"
	"os"
	"regexp"
	"strconv"
	"strings"
)

import "github.com/buger/jsonparser"

// Outputs of this script:
//   - json file with all plugin names plus their total downloads
//   - a json file for each plugin with their downloads over time

var downloadsOverTime = make(map[string]map[int64]int64)
var totalDownloads = make(map[string]int64)

func main() {
	processData("stats.json")
	saveJsonFile("total-downloads.json", totalDownloads)
	for pluginName, pluginDownloads := range downloadsOverTime {
		err := os.MkdirAll("./plugins", 0700)
		if err != nil {
			panic(err)
		}
		path := "./plugins/" + pluginName + ".json"
		saveJsonFile(path, pluginDownloads)
	}
}

func saveJsonFile[K comparable, V any](fileName string, data map[K]V) {
	println("Writing file:", fileName)
	file, err := json.MarshalIndent(data, "", "	")
	if err != nil {
		panic(err)
	}
	err = os.WriteFile(fileName, file, 0644)
	if err != nil {
		panic(err)
	}
}

func processData(fileName string) {
	readFile, err := os.Open(fileName)
	if err != nil {
		panic(err)
	}
	scan := bufio.NewScanner(readFile)
	scan.Split(bufio.ScanLines)

	jsonData := ""
	doCopy := false
	for scan.Scan() {
		line := scan.Text()
		if strings.HasPrefix(line, "{") {
			doCopy = true
			jsonData += line + "\n"
		} else if strings.HasPrefix(line, "}") {
			doCopy = false
			jsonData += line + "\n"
		} else if strings.HasPrefix(line, "author") {
			timestamp := parseTimestamp(line)
			parsePluginData(jsonData, timestamp)
			jsonData = ""
		} else if doCopy {
			jsonData += line + "\n"
		}
	}

	err = readFile.Close()
	if err != nil {
		panic(err)
	}
}

func parsePluginData(json string, timestamp int64) {
	jsonBytes := []byte(json)
	err := jsonparser.ObjectEach(jsonBytes, func(key []byte, value []byte, dataType jsonparser.ValueType, offset int) error {
		name := string(key)
		downloads, _ := jsonparser.GetInt(value, "downloads")
		if plugin, ok := downloadsOverTime[name]; !ok {
			plugin = make(map[int64]int64)
			downloadsOverTime[name] = plugin
		}
		// Ignore 0 values for downloads if there were more downloads before
		if downloads == 0 && len(downloadsOverTime[name]) != 0 {
			for _, prevDownloads := range downloadsOverTime[name] {
				if prevDownloads > 0 {
					return nil
				}
			}
		}
		downloadsOverTime[name][timestamp] = downloads
		totalDownloads[name] = downloads
		return nil
	})
	if err != nil {
		panic(err)
	}
}

func parseTimestamp(input string) int64 {
	// "author Obsidian Bot <admin@obsidian.md> 1672964166 +0000"
	rx, _ := regexp.Compile("\\b(\\d+)\\b")
	unixTime := rx.FindString(input)
	timestamp, err := strconv.ParseInt(unixTime, 10, 64)
	if err != nil {
		panic(err)
	}
	return timestamp
	/*
		i, err := strconv.ParseInt(unixTime, 10, 64)
		if err != nil {
			panic(err)
		}
		tm := time.Unix(i, 0)
		fmt.Println(tm)
		return tm
	*/
}
