import React from 'react'
import Indices from './Indices.js'
import Features from './Features.js'
import YearlyFeatures from './YearlyFeatures.js'
import YearlyIndices from './YearlyIndices.js'
import "../Styles/drought.css";

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

class Drought extends React.Component {
    

    start = '1995-06';
    end = '2017-05';
    min_dt = new Date('1995-06');
    max_dt = new Date('2017-05');
    state = { 
        data: [],
        inp_data: [], 
        yearly_data: [],
        yearly_inp_data: [],
        canvas_width: 1000,
        canvas_height: 550,
        threshold: -1.5,
        left_dt: this.min_dt,
        right_dt: this.max_dt,
        type: "features",
        discharge_file: "Upload discharge dataset", 
        precip_file: "Upload precipitation dataset" };

    uploadFile(file, is_discharge) {
        var url;
        if (is_discharge) {
            this.setState({ discharge_file: file.name });
            url = '/send_discharge_data';
        }
        else {
            this.setState({ precip_file: file.name });
            url = '/send_precip_data';
        }
        var formData = new FormData();

        formData.append('file', file);
        fetch(url, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(success => {
                console.log('success is', success);
                if (!is_discharge) {
                    this.load_data();
                    this.load_indices();
                    this.load_yearly_data();
                    this.load_yearly_indices();
                }
            })
            .catch(error => console.log(error)
            );
    }

    setFeatures = () => {
        console.log("Set features called");
        this.setState({ isindices: false });
    }

    setIndices = () => {
        console.log("Set indices called");
        this.setState({ isindices: true });
    }

    load_indices() {
        var url = `/get_indices?start=${encodeURIComponent(this.start)}&end=${encodeURIComponent(this.end)}`
        fetch(url, {
            method: 'GET',
        })
            .then(response => {
                console.log('response is', response);
                return response.json();
            })
            .then(res => {
                var data = [];
                for (var i = 0; i < res.dates.length; i++) {
                    data.push({ 'date': res.dates[i], 'spi': res.spi[i], 'sdi': res.sdi[i] });
                }
                this.setState({ data: data });
            })
            .catch(error => console.log(error)
            );
    }

    load_yearly_indices() {
        var url = `/get_yearly_indices?start=${encodeURIComponent(this.start)}&end=${encodeURIComponent(this.end)}`
        fetch(url, {
            method: 'GET',
        })
            .then(response => {
                console.log('response is', response);
                return response.json();
            })
            .then(res => {
                var data = [];
                for (var i = 0; i < res.dates.length; i++) {
                    data.push({ 'date': res.dates[i], 'spi': res.spi[i], 'sdi': res.sdi[i] });
                }
                this.setState({ yearly_data: data });
            })
            .catch(error => console.log(error)
            );
    }

    load_data = () => {
        var url = `/get_data?start=${encodeURIComponent(this.start)}&end=${encodeURIComponent(this.end)}`
        fetch(url, {
            method: 'GET',
        })
            .then(response => {
                console.log('/get_data response is', response);
                return response.json();
            })
            .then(res => {
                console.log(res);
                var inp_data = [];
                for (var i = 0; i < res.dates.length; i++) {
                    inp_data.push({ 'date': res.dates[i], 'discharge': res.discharge[i], 'precip': res.precip[i] });
                }
                console.log(inp_data);
                this.setState({ inp_data: inp_data });
            })
            .catch(error => console.log(error)
            );
    }

    load_yearly_data = () => {
        var url = `/get_yearly_data?start=${encodeURIComponent(this.start)}&end=${encodeURIComponent(this.end)}`
        fetch(url, {
            method: 'GET',
        })
            .then(response => {
                console.log('/get_yearly_data response is', response);
                return response.json();
            })
            .then(res => {
                console.log(res);
                var inp_data = [];
                for (var i = 0; i < res.dates.length; i++) {
                    inp_data.push({ 'date': res.dates[i], 'discharge': res.discharge[i], 'precip': res.precip[i] });
                }
                console.log(inp_data);
                this.setState({ yearly_inp_data: inp_data });
            })
            .catch(error => console.log(error)
            );
    }

    changeStartDate = (e) => {
        // console.log("start = ",e.toISOString());
        // this.start = e.toISOString().substring(0, 10);
        this.start = e.target.value;
        this.setState({ left_dt: new Date(this.start) });
        this.load_indices();
        this.load_data();
        this.load_yearly_data();
        this.load_yearly_indices();
    }

    changeEndDate = (e) => {
        // this.end = e.target.value.toISOString().substring(0, 10);
        this.end = e.target.value;
        this.setState({ right_dt: new Date(this.end) });
        this.load_indices();
        this.load_data();
        this.load_yearly_data();
        this.load_yearly_indices();
    }

    handleTypeChange = (changeTo) => {
        this.setState({type:changeTo});
    }

    updateThreshold = (e) => {
        this.setState({threshold: e.target.value});
    }

    render() {
        return (
            <div className="drt">
                <h3 className='drt-heading'>Drought Analyser</h3>
                <div className="cont">
                    <div className="form-container">
                        <Container maxWidth="xs" className="container">
                            <CssBaseline />
                            <form onSubmit={this.handleUploadImage} className="form-div">
                                <div className="input-div">
                                    <div className="input-title">
                                        Discharge Data 
                                    </div>
                                    <Input
                                        type="file"
                                        onChange={(e) => this.uploadFile(e.target.files[0], true)}
                                    />
                                    
                                </div>
                                <div className="input-div">
                                    <div className="input-title">
                                        Precipitation Data
                                    </div>
                                    <Input
                                        type="file"
                                        onChange={(e) => this.uploadFile(e.target.files[0], false)}
                                    />
                                </div>
                                <div className="input-div">
                                    <div className="date-cont">
                                        <div>
                                            <div className="input-title">Start Date</div>
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                id="start-date"
                                                label="YYYY-MM-DD"
                                                name="start-date"
                                                onBlur={this.changeStartDate}
                                                autoFocus
                                            />
                                        </div>
                                        <div>
                                            <div className="input-title">End Date</div>
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                id="end-date"
                                                label="YYYY-MM-DD"
                                                name="end-date"
                                                onBlur={this.changeEndDate}
                                            />
                                        </div>
                                    </div>
                                </div> 
                                <div className="option-input-div">
                                    <div className="input-title">
                                        Plot
                                    </div>
                                    <List>
                                        <ListItem>
                                            <div onClick={() => this.handleTypeChange("features")} className={this.state.type=="features" ? "active-div" : "inactive-div"}>
                                                Discharge and Precipitation (Monthly)
                                            </div>
                                        </ListItem>
                                        <ListItem>
                                            <div onClick={() => this.handleTypeChange("yearly_features")}  className={this.state.type=="yearly_features" ? "active-div" : "inactive-div"}>
                                                Discharge and Precipitation (Yearly)
                                            </div>
                                        </ListItem>
                                        <ListItem>
                                            <div onClick={() => this.handleTypeChange("indices")} className={this.state.type=="indices" ? "active-div" : "inactive-div"}>
                                                SPI and SDI (Monthly)
                                            </div>
                                        </ListItem>
                                        <ListItem>
                                            <div onClick={() => this.handleTypeChange("yearly_indices")} className={this.state.type=="yearly_indices" ? "active-div" : "inactive-div"}>
                                                SPI and SDI (Yearly)
                                            </div>
                                        </ListItem>
                                    </List>
                                </div>                   
                            </form>
                        </Container>
                    </div>
                    <div className="dropdown-container">
                        { this.state.type === "indices" && <Indices data={this.state.data} threshold={this.state.threshold} width={this.state.canvas_width} height={this.state.canvas_height}/>}
                        { this.state.type === "features" && <Features data={this.state.inp_data} width={this.state.canvas_width} height={this.state.canvas_height}/>}
                        { this.state.type === "yearly_indices" && <YearlyIndices data={this.state.yearly_data} threshold={this.state.threshold} width={this.state.canvas_width} height={this.state.canvas_height}/>}
                        { this.state.type === "yearly_features" && <YearlyFeatures data={this.state.yearly_inp_data} width={this.state.canvas_width} height={this.state.canvas_height}/>}
                    </div>
                </div>
            </div>
        );
    }
}

export default Drought;
