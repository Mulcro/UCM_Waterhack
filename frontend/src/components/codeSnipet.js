import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import { useEffect, useRef } from "react";
import "highlight.js/styles/tokyo-night-dark.css";

hljs.registerLanguage("python", python);

const CodeSnippet = () => {
    const codeRef = useRef();

    useEffect(() => {
        hljs.highlightBlock(codeRef.current);
    }, []);

    return (
    <pre >
      <code className="python" ref={codeRef}>
        {`    # -*- coding: utf-8 -*-
        """SWFWaterHack.ipynb

        Automatically generated by Colaboratory.

        Original file is located at
            https://colab.research.google.com/drive/1cLzl3Y55-BDkXRWUxk-gr72Dk0GtnvGE
        """

        import pandas as pd
        import matplotlib.pyplot as plot
        from scipy import stats
        from matplotlib.pyplot import figure
        import numpy as np
        import csv
        from sklearn.ensemble import RandomForestRegressor
        from sklearn.model_selection import train_test_split
        from sklearn.metrics import mean_squared_error, r2_score

        # Read in the precipitation data
        precipitation_data = pd.read_csv('BearCreek_precipitation.csv')

        # Read in the streamflow + stream height data
        stream_data = pd.read_csv('BearCreek_McKee_flow.csv')

        # Merge the two datasets based on the 'date' column
        merged_data = pd.merge(stream_data, precipitation_data, on='date')

        # Turn strings to floats 
        merged_data["prdaily"] = merged_data["prdaily"].astype('float')
        merged_data['Stage Height (feet)'] = merged_data['Stage Height (feet)'].astype('float')

        # Filter NaNs 
        filtered_data = merged_data.dropna()

        # New variables for filtered data
        prdaily = filtered_data["prdaily"]
        sgh = filtered_data['Stage Height (feet)']

        # Linear Regression
        slope, intercept, r, p, std_err = stats.linregress(prdaily,sgh)

        # Linear Regression Graph
        def lineFunc(x):
        return slope * x + intercept

        lineY = list(map(lineFunc, prdaily))

        plot.scatter(prdaily,sgh)
        plot.plot(prdaily,lineY, c = 'r')
        plot.title('Linear')
        plot.xlabel("Daily Precipitation (2002-2023)")
        plot.ylabel("Stage Height (feet)")
        plot.show()

        # Polynomial Regression Model
        prm = np.poly1d(np.polyfit(prdaily,sgh,2))

        # Polynomial Regression Graph
        xx = np.linspace(0, 26, 100)
        plot.plot(xx, prm(xx), c='r',linestyle='-')
        plot.title('Polynomial')
        plot.xlabel("Daily Precipitation (2002-2023)")
        plot.ylabel("Stage Height (feet)")
        plot.scatter(prdaily, sgh)
        plot.axis([0, 18, 0, 25])
        plot.show()

        # Random Forest Regression

        X = filtered_data["prdaily"].values.reshape(-1,1)
        y = filtered_data["Stage Height (feet)"]

        X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=0)

        regressor = RandomForestRegressor(n_estimators=100, random_state=0)

        X_grid = np.arange(min(X), max(X), 0.01)             
        X_grid = X_grid.reshape((len(X_grid), 1))

        regressor.fit(X_train, y_train)
        plot.scatter(X, y, color = 'blue') 
        plot.plot(X_grid, regressor.predict(X_grid),color = 'green')
        plot.title('Random Forest Regression')
        plot.xlabel('Daily Precipitation')
        plot.ylabel('Stage Height (feet)')
        plot.show()

        y_pred = regressor.predict(X_train)
        score = regressor.score(X_train, y_train)
        print("Random Forest Accuracy:", score)
        mse = mean_squared_error(y_train, y_pred)
        r2 = r2_score(y_train, y_pred)
        print("Mean Squared Error:", mse)
        print("R-squared:", r2)

        # Read in the future precipitation values
        fmodel = pd.read_csv('future_pr.csv')

        fpr = fmodel['avg_pr'].values.reshape(-1,1)

        new_sgh = regressor.predict(fpr)

        stageHeight = []

        for i in new_sgh:
        stageHeight.append(i)

        var1 = {'stage_height':stageHeight}
        var1_df = pd.DataFrame(var1)
        fmodel['stage_height'] = var1['stage_height']

        # Read in future precipitation dates
        f2 = pd.read_csv('BearCreek_precipitation_future.csv')
        fdates = f2['date']

        # New csv file with date, avg_pr, and stage_height
        f_df = pd.DataFrame()
        f_df['date'] = fdates
        f_df['avg_pr'] = fmodel['avg_pr']
        f_df['stage_height'] = fmodel['stage_height']
        f_df.to_csv("future.csv", index=False)

        # Future Precipitation Graph
        plot.scatter(fpr, var1_df['stage_height'], color = 'blue') 
        plot.plot(X_grid, regressor.predict(X_grid),color = 'green')
        plot.title('Random Forest Regression')
        plot.xlabel('Future Precipitation (average from 20 models)')
        plot.ylabel('Stage Height (feet)')
        plot.axis([0, 10, 0, 20])
        plot.show()
        `}
      </code>
    </pre>
  );
};

export default CodeSnippet;