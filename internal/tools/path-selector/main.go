package main

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
)

var version = "1.0.0"

type Tool struct {
	GamePath     string
	OatPath      string
	ProjectRoot  string
	Locale       string
}

func main() {
	t := &Tool{
		OatPath:     filepath.Join("..", "oat-windows"),
		ProjectRoot: filepath.Join("..", ".."),
		Locale:      "brazilian",
	}

	detected, err := detectGamePath()
	if err == nil {
		t.GamePath = detected
	} else {
		t.GamePath = promptPath("Enter Call of Duty Black Ops II path")
	}

	menu(t)
}

func menu(t *Tool) {
	scanner := bufio.NewScanner(os.Stdin)
	for {
		fmt.Println()
		fmt.Println("=== BO2 PT-BR Translation Tool ===")
		fmt.Printf("Game path: %s\n", t.GamePath)
		fmt.Printf("OAT path:  %s\n", t.resolveOatBin())
		fmt.Println()
		fmt.Println("[1] Extract all .ff files (Unlinker)")
		fmt.Println("[2] Build all .ff files (Linker)")
		fmt.Println("[3] Change game path")
		fmt.Println("[4] Exit")
		fmt.Print("\nChoose an option: ")

		if !scanner.Scan() {
			break
		}
		choice := strings.TrimSpace(scanner.Text())

		switch choice {
		case "1":
			t.extract()
		case "2":
			t.build()
		case "3":
			t.GamePath = promptPath("Enter new Call of Duty Black Ops II path")
			saveGamePath(t.GamePath)
		case "4":
			fmt.Println("Exiting.")
			return
		default:
			fmt.Println("Invalid option. Choose 1-4.")
		}
	}
}

func (t *Tool) resolveOatBin() string {
	return filepath.Join(t.OatPath, "Unlinker.exe")
}

func (t *Tool) extract() {
	unlinker := t.resolveOatBin()
	if _, err := os.Stat(unlinker); os.IsNotExist(err) {
		fmt.Printf("Error: Unlinker.exe not found at %s\n", unlinker)
		fmt.Println("Download OpenAssetTools and place it in internal/tools/oat-windows/")
		return
	}

	englishZone := filepath.Join(t.GamePath, "zone", "english")
	if _, err := os.Stat(englishZone); os.IsNotExist(err) {
		fmt.Printf("Error: zone/english not found at %s\n", englishZone)
		return
	}

	zones := []string{
		"common_mp.ff",
		"common_zm.ff",
		"code_post_gfx_mp.ff",
		"code_post_gfx_zm.ff",
		"ui_mp.ff",
		"ui_zm.ff",
		"patch_mp.ff",
		"patch_zm.ff",
		"patch_ui_mp.ff",
		"patch_ui_zm.ff",
	}

	sourceDir := filepath.Join(t.ProjectRoot, "translation", "source")
	os.MkdirAll(sourceDir, 0755)

	for _, zone := range zones {
		fmt.Printf("Extracting %s...\n", zone)
		zonePath := filepath.Join(englishZone, zone)
		if _, err := os.Stat(zonePath); os.IsNotExist(err) {
			fmt.Printf("  Skipping (not found): %s\n", zonePath)
			continue
		}

		cmd := exec.Command(unlinker, "--search-path", englishZone, zonePath)
		cmd.Dir = sourceDir
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		if err := cmd.Run(); err != nil {
			fmt.Printf("  Failed: %v\n", err)
		}
	}

	fmt.Println("\nDone! Extracted files are in translation/source/zone_dump")
	fmt.Println("Move zone_dump/zone_raw/* to translation/source/zone_raw/")
}

func (t *Tool) build() {
	linker := filepath.Join(t.OatPath, "Linker.exe")
	if _, err := os.Stat(linker); os.IsNotExist(err) {
		fmt.Printf("Error: Linker.exe not found at %s\n", linker)
		fmt.Println("Download OpenAssetTools and place it in internal/tools/oat-windows/")
		return
	}

	englishZone := filepath.Join(t.GamePath, "zone", "english")
	ptbrZoneSource := filepath.Join(t.ProjectRoot, "translation", "ptbr", "zone_source")
	ptbrOutput := filepath.Join(t.ProjectRoot, "translation", "ptbr", "zone", t.Locale)
	ptbrRaw := filepath.Join(t.ProjectRoot, "translation", "ptbr", "zone_raw")

	os.MkdirAll(ptbrOutput, 0755)

	zones := []string{
		"common_mp",
		"common_zm",
		"code_post_gfx_mp",
		"code_post_gfx_zm",
		"ui_mp",
		"ui_zm",
		"patch_mp",
		"patch_zm",
		"patch_ui_mp",
		"patch_ui_zm",
	}

	for _, zone := range zones {
		zoneSource := filepath.Join(ptbrZoneSource, zone+".zone")
		if _, err := os.Stat(zoneSource); os.IsNotExist(err) {
			fmt.Printf("Skipping %s (no zone source)\n", zone)
			continue
		}

		fmt.Printf("Building %s...\n", zone)
		sourceZone := filepath.Join(englishZone, zone+".ff")
		if _, err := os.Stat(sourceZone); os.IsNotExist(err) {
			fmt.Printf("  Skipping (source ff not found): %s\n", sourceZone)
			continue
		}

		cmd := exec.Command(linker,
			"--load", sourceZone,
			"--asset-path", ptbrRaw,
			"--zone-path", ptbrZoneSource,
			"--outdir", ptbrOutput,
			"--verbose",
			zone,
		)
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		if err := cmd.Run(); err != nil {
			fmt.Printf("  Failed: %v\n", err)
		}
	}

	fmt.Printf("\nDone! Brazilian patch files are in %s\n", ptbrOutput)
}

func detectGamePath() (string, error) {
	common := []string{
		`C:\Program Files (x86)\Steam\steamapps\common\Call of Duty Black Ops II`,
		`C:\Program Files\Steam\steamapps\common\Call of Duty Black Ops II`,
	}

	if runtime.GOOS == "windows" {
		localAppData := os.Getenv("LOCALAPPDATA")
		if localAppData != "" {
			common = append(common,
				filepath.Join(localAppData, `Plutonium\storage\t6`),
			)
		}
		programData := os.Getenv("PROGRAMDATA")
		if programData != "" {
			common = append(common,
				filepath.Join(programData, `Plutonium\storage\t6`),
			)
		}
	}

	for _, p := range common {
		if _, err := os.Stat(filepath.Join(p, "zone", "english")); err == nil {
			return p, nil
		}
	}

	loaded, err := loadGamePath()
	if err == nil && loaded != "" {
		if _, err := os.Stat(filepath.Join(loaded, "zone", "english")); err == nil {
			return loaded, nil
		}
	}

	return "", fmt.Errorf("game path not found")
}

func promptPath(msg string) string {
	scanner := bufio.NewScanner(os.Stdin)
	for {
		fmt.Printf("%s: ", msg)
		if !scanner.Scan() {
			return ""
		}
		p := strings.TrimSpace(scanner.Text())

		if p == "" {
			fmt.Println("Path cannot be empty.")
			continue
		}

		// Remove surrounding quotes if user typed them
		p = strings.Trim(p, `"'`)

		if _, err := os.Stat(filepath.Join(p, "zone", "english")); os.IsNotExist(err) {
			fmt.Printf("Warning: zone/english not found in %s\n", p)
			fmt.Print("Use this path anyway? (y/N): ")
			if !scanner.Scan() {
				continue
			}
			if strings.ToLower(strings.TrimSpace(scanner.Text())) != "y" {
				continue
			}
		}

		return p
	}
}

const gamePathFile = "gamepath.txt"

func saveGamePath(path string) {
	os.WriteFile(gamePathFile, []byte(path), 0644)
	fmt.Printf("Path saved to %s\n", gamePathFile)
}

func loadGamePath() (string, error) {
	data, err := os.ReadFile(gamePathFile)
	if err != nil {
		return "", err
	}
	return strings.TrimSpace(string(data)), nil
}
