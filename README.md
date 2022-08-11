# Project CovidStats

## Summary/Description
This project will be focusing on COVID-19. The website will visualize statistics like the number of cases, deaths, and cures in the US and other countries both individually and in proportion to total population. There will be graphs to track growth of the virus in multiple countries as well as the ability to compare them. We plan to create bar graphs, line graphs, and maybe even pie charts to represent these statistics.

## Datasets
(https://github.com/owid/covid-19-data/tree/master/public/data)  
This dataset provides information about the number of Covid-19 cases for each country. It provides specific up to data
statistics for confirmed cases, total deaths, new cases, and total population.

## How to Run the Project:  
### Requirements:
Python3 and pip is required to run the project  
[Download Python3 here](https://www.python.org/downloads/) (pip3 comes with python3 download)
requirements can be found in doc/requirements.txt

### Run the project:
1. Create a virtual environment with `python3 -m venv <virtual-environment-name>`.
2. Use `<virtual-environment-name>/Scripts/activate` to activate your virtual environment. <br> Use `source <virtual-environment-name>/Scripts/activate` if you are using Git Bash.
3. Clone this project and `cd` into the cloned repository.
4. Use `python3 app.py` to run the project on your local host.
5. Go to the url listed as the local host.  

## To-do
- Fix/improve 50 lowest confirmed cases country graph on the homepage.
  - Currently has too much space for a small graph.
  - Could convert to 50 highest confirmed cases but certain countries massively skews the graph.
