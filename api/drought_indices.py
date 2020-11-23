import pandas as pd
from climate_indices import compute, indices
import matplotlib.pyplot as plt
import datetime
import numpy as np

class Drought:

    def __init__(self):
        self.data_year_start_monthly = 1995
        self.data_year_end_monthly = 2017

    def set_discharge(self, df):
        df['Date'] = pd.to_datetime(df[['Year', 'Month', 'Day']],errors='coerce')
        df = df.set_index(df['Date'])
        df = df.drop(df.columns[[0,1,2,4]], axis=1)
        df = df.fillna(0)
        self.df_discharge = df

    def set_precip(self, df):
        df['Date'] = pd.to_datetime(df[['Year', 'Month', 'Day']],errors='coerce')
        df = df.set_index(df['Date'])
        df = df.drop(df.columns[[0,1,2,4]], axis=1)
        df = df.fillna(0)
        df = df.replace(0, df.mean())
        self.df_precip = df

    def get_discharge(self,start,end):
        df_discharge = self.df_discharge.loc[start: end]
        df_discharge_monthly_mean = df_discharge['Item'].resample('M').mean()
        dis = np.nan_to_num(df_discharge_monthly_mean)
        return dis

    def get_precip(self,start,end):
        df_precip = self.df_precip.loc[start: end]
        df_precip_monthly_mean = df_precip['Data'].resample('M').mean()
        precip = np.nan_to_num(df_precip_monthly_mean)
        return precip

    def get_yearly_discharge(self,start,end):
        df_discharge = self.df_discharge.loc[start: end]
        df_discharge_yearly_mean = df_discharge['Item'].resample('A-MAY').sum()
        dis = np.nan_to_num(df_discharge_yearly_mean)
        return dis

    def get_yearly_precip(self,start,end):
        df_precip = self.df_precip.loc[start: end]
        df_precip_yearly_mean = df_precip['Data'].resample('A-MAY').sum()
        precip = np.nan_to_num(df_precip_yearly_mean)
        return precip

    def get_dates(self,start,end):
        Period = pd.date_range(start=start, end=end, freq='M')
        return Period.strftime('%Y-%m').tolist()

    def get_yearly_dates(self,start,end):
        Period = pd.date_range(start=start, end=end, freq='Y')
        return Period.strftime('%Y').tolist()

    def get_indices(self, start, end):
        sdi = indices.spi(self.get_discharge(start,end),12,indices.Distribution.gamma,self.data_year_start_monthly,self.data_year_start_monthly,self.data_year_end_monthly,compute.Periodicity.monthly)
        spi = indices.spi(self.get_precip(start,end),12,indices.Distribution.gamma,self.data_year_start_monthly,self.data_year_start_monthly,self.data_year_end_monthly,compute.Periodicity.monthly)

        sdi, spi = np.nan_to_num(sdi), np.nan_to_num(spi)

        return sdi,spi,self.get_dates(start,end)

    def get_yearly_indices(self, start, end):
        df_discharge, df_precip = self.df_discharge.loc[start: end], self.df_precip.loc[start: end]

        df_discharge_monthly_sum = df_discharge['Item'].resample('M').mean()
        df_discharge_yearly_sum = df_discharge_monthly_sum.resample('A-MAY').mean()
        df_discharge_yearly_mean = df_discharge_monthly_sum.mean()
        df_discharge_yearly_SD = df_discharge_monthly_sum.std()
        df_precip_monthly_sum = df_precip['Data'].resample('M').mean()
        df_precip_yearly_mean = df_precip_monthly_sum.resample('A-MAY').mean()
        df_precip_monthly_SD = df_precip_monthly_sum.std()
        df_precip_monthly_mean = df_precip_monthly_sum.mean()

        SDI = (df_discharge_yearly_sum[:] - df_discharge_yearly_mean)/df_discharge_yearly_SD
        SPI = (df_precip_yearly_mean[:] - df_precip_monthly_mean)/df_precip_monthly_SD

        SPI = SPI.fillna(SPI.mean())

        return list(SDI.values),list(SPI.values),self.get_yearly_dates(start,end)


if __name__ == "__main__":
    df_discharge = pd.read_csv('Drought/Balehonnur.csv',index_col=0, parse_dates=True, squeeze=True)
    df_precip = pd.read_csv('Drought/Balehonnur_rain.csv',index_col=0, parse_dates=True, squeeze=True)
    drought = Drought()
    drought.set_discharge(df_discharge)
    drought.set_precip(df_precip)
    start, end = '2005-06','2017-05'
    print(len(drought.get_yearly_discharge(start, end)))
    print(len(drought.get_yearly_dates(start, end)))
    print(len(drought.get_yearly_precip(start,end)))
    print(drought.get_yearly_indices(start,end))
    # sdi=pd.DataFrame(index = Period,data=sdi)
    # spi=pd.DataFrame(index = Period,data=spi)

    # fig, ax = plt.subplots(figsize=(50, 15))
    # ax.xaxis.grid()

    # ax.plot(sdi, marker='o',markersize=0,label='SDI (Balehonnur Station)', lw=5,color='#FF00FF')
    # ax.plot(spi, marker='o',markersize=0,label='SPI (Balehonnur Station)', lw=5,color='#006AB2')
    # ax.set_xlim([datetime.date(2006, 6, 1), datetime.date(2017, 5, 31)])


    # plt.legend(loc='upper right',fontsize=42,ncol=3)
    # plt.grid(True,linestyle='--')
    # plt.xlabel('Year', fontsize=42)
    # plt.ylabel('Drought Index', fontsize=42)
    # plt.axhline(y=0, color='green', linestyle='--', linewidth=3)
    # plt.axhline(y=-1.5, color='red', linestyle='--', linewidth=3)
    # plt.tick_params(labelsize=42)
    # plt.yticks(np.arange(-3.0, 2.0, 0.5))
    # plt.show()






