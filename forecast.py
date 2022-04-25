import numpy as np
import tensorflow as tf
import pandas as pd

from tensorflow import keras
from datetime import datetime
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from math import sqrt

def get_scaled(df, scaler, time_steps):
    df_scaled = scaler.transform(np.array(df.tail(time_steps)).reshape(-1, 1))
    return df_scaled
    
def get_inverse(pred_values, scaler):
    df_inverse = scaler.inverse_transform(pred_values.reshape(-1,1)).reshape(-1)
    return np.round(df_inverse, decimals=0)

def read_file(path):
    file = pd.read_csv(path, index_col='date')
    pd.to_datetime(file.index, format='%Y-%m-%d')
    file = file.sort_values(by='date', ascending=True)
    file = file[-30:]
    
    file_reset = file.reset_index()
    file_tuple = list(file_reset.itertuples(index=False, name=None))
    return file, file_tuple

def check_dates(file):
    bool = file['date'].max().to_pydatetime() <= datetime.now()
    print(bool)
    return bool

def validate_file(df):
    df = df[-30:]

    datesdf = pd.DataFrame({"date": df["date"]})
    datesdf = datesdf.reset_index(drop=True)
    dates = pd.date_range(start=df['date'].min(), end=df['date'].max())
    dates= dates.to_frame(index=False, name='date')
    
    if dates.shape[0] != df.shape[0]:
        message = "Uh oh! It looks like your file contains invalid data. Please make sure that your file follows the format."
        return message, 2
    elif dates["date"].equals(datesdf["date"]) == False:
        message = "Uh oh! It looks like your file contains invalid dates. Please make sure that your file follows the format."
        return message, 3
    elif df['date'].max().to_pydatetime() > datetime.now():
        message = "Uh oh! It looks like your file contains present and future dates. Please make sure that your file is a historical data."
        return message, 4    
    else:
        return None, True
def process_json_data(dates, cases):

    cases_df = pd.DataFrame({'date':dates,'cases':cases})
    cases_df['date'] = pd.to_datetime(cases_df['date'])
    cases_df.set_index('date', inplace=True)
    return cases_df

def forecast(df, days_ahead, model, time_steps, scaler):
    pred_values = []
    df_scaled = get_scaled(df, scaler, time_steps).reshape(1, time_steps, 1)
    for _ in range(days_ahead):
        pred = model.predict(df_scaled)
        pred_values.append(max(0, pred[0][0]))
        df_scaled = np.append(df_scaled, pred.reshape(1, 1, 1), axis=1)
        df_scaled = df_scaled[:, 1 :]
    pred_values = np.array(pred_values)
    return pred_values

def predict_dates(df, days_ahead, dates):
    last_date = len(df.index)-1
    last_date = df.index[last_date]
    if dates is None:
        csv_pred_dates = pd.date_range(last_date, periods=days_ahead+1).tolist()
        return csv_pred_dates
    else:
        json_latest_date = datetime.strptime(dates[0], '%Y-%m-%dT%H:%M:%S.%fZ').date()
        json_pred_dates = pd.date_range(json_latest_date, periods=days_ahead+1).tolist()
        return json_pred_dates
    
def get_result(df, pred_values, days_ahead, scaler, dates):
    pred_cases = get_inverse(pred_values, scaler)
    
    pred_cases = np.insert(pred_cases, 0, np.array(df.tail(1)['cases']), axis=0)

    if dates is None:
        pred_dates = predict_dates(df, days_ahead, dates=None)
    else:
        pred_dates = predict_dates(df, days_ahead, dates)

    dates_list = [t.strftime("%Y-%m-%d") for t in pred_dates]

    forecasted_cases = np.asarray(pred_cases, dtype=np.int64)
    forecasted_cases = forecasted_cases.tolist() 
    forecasted_tuple = [( dates_list[i], forecasted_cases[i]) for i in range(1, len( dates_list))]
    return forecasted_tuple

def validate(y_true, y_pred):
    mae = mean_absolute_error(y_true, y_pred)
    rmse = sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)
    residuals_tuple = validate_tuple(mae, rmse, r2)
    return residuals_tuple

def validate_tuple(mae, rmse, r2):
    values = []
    values.append(rmse)
    values.append(mae)
    values.append(r2)
    values = [round(x,2) for x in values]
    labels = ['RMSE', 'MAE', 'R^2']

    residuals_tuple = [(labels[i], values[i]) for i in range(0, len(labels))]

    return residuals_tuple
def append_null(list):
    list = [round(x) for x in list] 
    list = [str(list) for list in list]

    for i in range(len(list), len(list)+14):
        list[i] = list.append(None)
    return list