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

import "github.com/buger/jsonparser"

// Outputs of this script:
//   - json file with all plugin names plus their total downloads
//   - a json file for each plugin with their downloads over time

var downloadsOverTime = make(map[string]map[int64]int64)
var totalDownloads = make(map[string]int64)

func main() {
	processData("stats.json")
	println(len(downloadsOverTime))
	println(len(totalDownloads))
	saveJsonFile("total-downloads.json", totalDownloads)
	saveJsonFile("downloads-over-time.json", downloadsOverTime)
}

func saveJsonFile[V any](fileName string, data map[string]V) {
	file, _ := json.MarshalIndent(data, "", "	")
	_ = os.WriteFile(fileName, file, 0644)
}

func processData(fileName string) {
	readFile, err := os.Open(fileName)
	if err != nil {
		fmt.Println(err)
	}
	scan := bufio.NewScanner(readFile)
	scan.Split(bufio.ScanLines)

	jsonData := ""
	copy := false
	for scan.Scan() {
		line := scan.Text()
		if strings.HasPrefix(line, "{") {
			copy = true
			jsonData += line + "\n"
		} else if strings.HasPrefix(line, "}") {
			copy = false
			jsonData += line + "\n"
		} else if strings.HasPrefix(line, "author") {
			timestamp := parseTimestamp(line)
			parsePluginData(jsonData, timestamp)
			jsonData = ""
		} else if copy {
			jsonData += line + "\n"
		}
	}

	err = readFile.Close()
	if err != nil {
		// TODO
	}
}

func parsePluginData(json string, timestamp int64) {
	jsonBytes := []byte(json)
	jsonparser.ObjectEach(jsonBytes, func(key []byte, value []byte, dataType jsonparser.ValueType, offset int) error {
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
