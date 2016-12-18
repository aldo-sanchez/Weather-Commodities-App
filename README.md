# Weather-Commodities-App
Historical weather and commodities price visualization tool.

Synopsis
This tool can be utilized to visualize historical weather data and commodities futures prices.  
User can select commodity, one of top three producing regions, and date range for visualization. Visualization is available in a chart.js line plot with three y-axis (temperature and precipitation on the left side and price on the right side).  

![Alt text](assets/images/samplePlot.png "sample visualization")

 Currently, data available are monthly average temperature, precipitation, and commodity price. taken from NOAA’s GSOM data sets from 2005 to 2015.   
Data Gathering and Storage:
This tool uses two API’s:
1.	NOAA GSOM historical average data sets
2.	Quandl commodity futures historical pricing
Data from APIs is stored in Firebase for future use.  
Charting Tools
Chart.js is used to create a line graph of price and weather data over a range of time.
Google’s Geo Chart is used to display and select US top producers of a specified commodity.
CSS Styling
Google’s Materialize CSS is the main styling library used in this project.
Icons



