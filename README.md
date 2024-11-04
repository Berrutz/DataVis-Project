# Data Visualization Project

In this repository you will find the application developed for the datab visualization projects.

## Requirements

### Node

`node` is required to run the web application.

To install `node` follow the procedures on the [official website](https://nodejs.org/en).

### Python

`python` is only used for data preprocessing, so if you don't need to run data preprocessing procedures you don't need to install it.

To install `python` follow the procedures on the [official website](https://www.python.org/downloads/)

### Package Manager

In order to install packages in the project usa `yarn`.

Installing yarn is pretty simple. Make sure that you have `npm` installed and run the following command:

```bash
npm install --global yarn
```

#### How to use yarn

Installing packages:

```bash
yarn add [package-name]
```

Remove package:

```bash
yarn remove [package-name]
```

## How to run the project

### Run the project for development

To run the project in development mode enter the application folder and run the following command:

```bash
cd web-application
yarn
yarn dev
```

in this way the next application will start the development server.

## Data Processing

If you want to run the data processing procedure with python you can create a virtual environment and install the file `requirements.txt` that you can find in the `data-processing` folder.

The following instructions demostrate how to create, activate and install the dependecies needed for data pre-processing. Note that this procedure can vary based on your OS, linux have the same procedure but with different filenames and/or paths (e.g. the command `python` in windows is `python3` in linux) so check on internet the right procedure.

Enter the data processing folder:

```bash
cd ./data-processing
```

Create a virtual environment:

```bash
python -m venv ./env
```

Activate the virtual environment:

```bash
./env/Scripts/activate
```

Install the dependecies:

```bash
pip install -r ./requirements.txt
```
