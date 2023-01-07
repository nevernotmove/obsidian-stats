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

var pluginStats = make(map[string]map[int64]int64)

func main() {
	processData()
	file, _ := json.MarshalIndent(pluginStats, "", "	")
	_ = os.WriteFile("downloads.json", file, 0644)
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

func processData() {
	readFile, err := os.Open("stats.json")
	if err != nil {
		fmt.Println(err)
	}
	scan := bufio.NewScanner(readFile)
	scan.Split(bufio.ScanLines)

	jsonData := ""
	doCopy := false
	for scan.Scan() {
		s := scan.Text()
		if strings.HasPrefix(s, "{") {
			doCopy = true
		} else if strings.HasPrefix(s, "}") {
			doCopy = false
		} else if strings.HasPrefix(s, "author") {
			timestamp := parseTimestamp(s)
			parsePluginData(jsonData, timestamp)
			jsonData = ""
		}
		if doCopy {
			jsonData += s + "\n"
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
		if plugin, ok := pluginStats[name]; !ok {
			plugin = make(map[int64]int64)
			pluginStats[name] = plugin
		}
		// Ignore 0 values for downloads if there were more downloads before
		if downloads == 0 && len(pluginStats[name]) != 0 {
			for _, prevDownloads := range pluginStats[name] {
				if prevDownloads > 0 {
					return nil
				}
			}
		}
		pluginStats[name][timestamp] = downloads
		return nil
	})
}
