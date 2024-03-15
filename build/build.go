package build

import (
	"fmt"
	"math/rand"
	"os"
	"os/exec"
	"strings"
	"sync"
	"time"

	"github.com/bocianowski1/beerconsulting/colors"
	"github.com/bocianowski1/beerconsulting/db"
)

func BuildProject(projectName string, features []*db.OrderFeature) (string, error) {
	errCh := make(chan error)
	var (
		url string
		wg  = sync.WaitGroup{}
	)
	startTime := time.Now()

	if projectNameAlreadyExists(projectName) {
		projectName = projectName + fmt.Sprintf("-%d", rand.Intn(1000))
	}

	println(colors.CYAN, "Creating project directory...")
	initProject(projectName)

	wg.Add(5)
	go func() {
		defer wg.Done()

		println(colors.GREEN, "Creating repository...")
		cmd := exec.Command("gh", "repo", "create", projectName, "--private")
		cmd.Dir = projectName
		output, err := cmd.Output()
		if err != nil {
			fmt.Printf("Failed to create repository: %v\n", err)
			errCh <- err
		}

		fmt.Println("Repository created successfully!")
		url = string(output)
		url = strings.TrimSpace(url)
		fmt.Println("URL:", url)
	}()
	go func() {
		defer wg.Done()

		println(colors.CYAN, "Copying common files...")
		err := copyFromFolder("common", projectName)
		if err != nil {
			errCh <- err
		}
	}()
	go func() {
		defer wg.Done()

		println(colors.YELLOW, "Cloning repository...")
		if err := exec.Command("git", "clone", "https://github.com/bocianowski1/beer-modules.git", "modules").Run(); err != nil {
			fmt.Printf("Failed to clone repository: %v\n", err)
			errCh <- err
		}

	}()
	go func() {
		defer wg.Done()

		fmt.Println("Installing dependencies...")
		// cmd := exec.Command("pnpm", "install")
		// cmd.Dir = projectName + "/web"
		// if err := cmd.Run(); err != nil {
		// 	fmt.Printf("Failed to install dependencies: %v\n", err)
		// }
	}()
	go func() {
		defer wg.Done()

		if err := initialPushToGitHub(projectName, url); err != nil {
			errCh <- err
		}
	}()

	wg.Wait()
	close(errCh)

	for err := range errCh {
		if err != nil {
			println(colors.RED, "Error building project:", err)
			return url, err
		}
	}

	// for each feature in the order,
	// copy the feature to the project from the modules directory
	for _, feature := range features {
		fmt.Println("Copying feature:", feature.Name)

		for _, option := range feature.Options {
			if option.IsSelected {
				fmt.Println("Copying option:", option.Name)
				if err := copyFromFolder(
					fmt.Sprintf("modules/%s/%s",
						feature.Name, option.Name),
					fmt.Sprintf("%s/%s/%s",
						projectName, feature.Name, option.Name)); err != nil {
					fmt.Printf("Failed to copy feature %s: %v\n", feature.Name, err)
					return url, err
				}
			}
		}
	}

	// clean up
	if err := os.RemoveAll("modules"); err != nil {
		fmt.Println("Error removing modules directory: ", err)
	}
	if err := os.RemoveAll(projectName); err != nil {
		fmt.Println("Error removing project directory: ", err)
	}

	fmt.Println("Project created successfully!")
	fmt.Println("Time elapsed:", time.Since(startTime))

	return url, nil
}

func initProject(projectName string) {
	if err := exec.Command("mkdir", projectName).Run(); err != nil {
		fmt.Printf("Failed to create project directory: %v\n", err)
		return
	}

	cmd := exec.Command("git", "init")
	cmd.Dir = projectName
	if err := cmd.Run(); err != nil {
		fmt.Printf("Failed to initialize git: %v\n", err)
	} else {
		println(colors.GREEN, "Git initialized")
	}

	cmd = exec.Command("go", "mod", "init", projectName)
	cmd.Dir = projectName
	if err := cmd.Run(); err != nil {
		fmt.Printf("Failed to initialize go module: %v\n", err)
	} else {
		println(colors.GREEN, "Go module initialized")
	}
}

func copyFromFolder(src, dest string) error {
	files, err := os.ReadDir(src)
	if err != nil {
		return err
	}

	wg := sync.WaitGroup{}
	wg.Add(len(files))
	for _, file := range files {
		go func(file os.DirEntry) {
			defer wg.Done()
			cmd := exec.Command("cp", "-a", fmt.Sprintf("%s/%s", src, file.Name()), fmt.Sprintf("%s/%s", dest, file.Name()))
			if err := cmd.Run(); err != nil {
				fmt.Printf("Failed to copy file %s: %v\n", file.Name(), err)
			}
		}(file)
	}

	wg.Wait()
	return nil
}

func projectNameAlreadyExists(projectName string) bool {
	cmd := exec.Command("gh", "repo", "list")
	out, err := cmd.Output()
	if err != nil {
		fmt.Printf("Failed to list repositories: %v\n", err)
		return false
	}

	list := strings.Split(string(out), "\n")

	for _, repo := range list {
		if strings.Contains(repo, projectName) {
			return true
		}
	}

	return false
}

func initialPushToGitHub(projectName, url string) error {
	var cmd *exec.Cmd
	cmd = exec.Command("git", "add", ".")
	cmd.Dir = projectName
	if err := cmd.Run(); err != nil {
		fmt.Printf("Failed to add files to git: %v\n", err)
		return err
	}

	cmd = exec.Command("git", "commit", "-m", "Initial commit")
	cmd.Dir = projectName
	if err := cmd.Run(); err != nil {
		fmt.Printf("Failed to commit files to git: %v\n", err)
		return err
	}

	cmd = exec.Command("git", "branch", "-M", "main")
	cmd.Dir = projectName
	if err := cmd.Run(); err != nil {
		fmt.Printf("Failed to commit files to git: %v\n", err)
		return err
	}

	if !strings.HasSuffix(url, ".git") {
		url = fmt.Sprintf("%s.git", url)
	}

	cmd = exec.Command("git", "remote", "add", "origin", url)
	cmd.Dir = projectName
	if err := cmd.Run(); err != nil {
		fmt.Printf("Failed to add origin %s: %v\n", url, err)
		return err
	}

	// print branch in git
	cmd = exec.Command("git", "branch")
	cmd.Dir = projectName
	out, err := cmd.Output()
	if err != nil {
		fmt.Printf("Failed to get branch: %v\n", err)
		return err
	}

	fmt.Println(string(out))

	fmt.Println("Pushing to git...")
	cmd = exec.Command("git", "push", "-u", "origin", "main")
	cmd.Dir = projectName
	out, err = cmd.Output()
	if err != nil {
		fmt.Printf("Failed to push to git: %v\n", err)
		return err
	}

	fmt.Println(string(out))

	return nil
}
