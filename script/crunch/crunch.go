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
	readPluginInfos("community-plugins.json")
	processData("stats.json")
	err := os.MkdirAll("./plugins", 0700)
	if err != nil {
		panic(err)
	}
	for pluginName, pluginDownloads := range downloadsOverTime {
		path := "./plugins/" + pluginName + ".json"
		saveToJsonFile(path, pluginDownloads)
	}
	saveToJsonFile("plugins.json", pluginInfos)
}

func readPluginInfos(fileName string) {
	data, err := os.ReadFile(fileName)
	if err != nil {
		panic(err)
	}
	if err := json.Unmarshal(data, &pluginInfos); err != nil {
		panic(err)
	}
}

func saveToJsonFile[V any](fileName string, data V) {
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

		for i, plugin := range pluginInfos {
			if plugin.Id == name && downloads > plugin.Downloads {
				plugin.Downloads = downloads
				pluginInfos[i] = plugin
			}
		}

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
}
