import {Box} from "@mui/material";
import {SparkLineChart} from "@mui/x-charts";
import {Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart, Tooltip, XAxis, YAxis} from "recharts";
import {Form} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import CurrencyFormatter from "../../../util/CurrencyFormatter";
import {useNavigate} from "react-router-dom";
import RootPathApi from "../../../route/RootPathApi";


const Dashboard = () => {
    const [revenue, setRevenue] = useState(0);
    const [userAmount, setUserAmount] = useState(0);
    const [orderAmount, setOrderAmount] = useState(0);
    const [dataPieChart, setDataPieChart] = useState([
        { name: 'Laptop', value: 0 },
        { name: 'Bàn phím', value: 0 },
        { name: 'Chuột', value: 0 },
        { name: 'Ram', value: 0 },
    ]);
    const [dataAreaChart, setDataAreaChart] = useState([]);
    const monthsAreaChart = Array.from({ length: 12 }, (_, i) => i + 1);
    const [categorys, setCategory] = useState([]);
    const [monthPie, setMonthPie] = useState(0);
    const [yearPie, setYearPie] = useState(2024);
    const [year, setYear] = useState(2024);
    const [months, setMonths] = useState([]);
    const [years, setYears] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const accessToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();
    const baseUrl = RootPathApi()

    useEffect(() => {
        const fetchYear = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/management/dashboard/get-years`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setYears(res.data);
            } catch (error) {
                console.error("Error fetching years", error);
                navigate("/404");
            }
        };
        fetchYear();
    }, []);

    useEffect(() => {
        if (years.length > 0) {
            setYearPie(years[0]);
            setYear(years[0]);
        }
    }, [years]);

    useEffect(() => {
        const fetchMonth = async () => {
            try {
                if (yearPie) {
                    const res = await axios.get(`${baseUrl}/api/v1/management/dashboard/get-months/${yearPie}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    const sortedMonths = [...res.data].sort((a, b) => a - b);
                    setMonths(sortedMonths);
                    if (sortedMonths.length > 0) {
                        setMonthPie(sortedMonths[0]);
                    }
                    // setMonthPie(months[0]);
                    console.log(months[0])
                }
            } catch (error) {
                console.error("Error fetching months", error);
                navigate("/404");
            }
        };
        fetchMonth();
    }, [yearPie]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/management/dashboard/total-revenue`, {
                    params: { year: year },
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setRevenue(res.data);
                console.log(res.data); // In dữ liệu nhận được để kiểm tra
            } catch (error) {
                console.error("Error fetching revenue data", error);
                navigate("/404");
            }
        };

        fetchData();
    }, [year]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/management/dashboard/count-order-in-year`, {
                    params: { year: year },
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setOrderAmount(res.data);
                console.log(res.data); // In dữ liệu nhận được để kiểm tra
            } catch (error) {
                console.error("Error fetching order data", error);
                navigate("/404");
            }
        };

        fetchData();
    }, [year]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/management/dashboard/count-user`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setUserAmount(res.data);
                console.log(res.data); // In dữ liệu nhận được để kiểm tra
            } catch (error) {
                console.error("Error fetching user data", error);
                navigate("/404");
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/category/all`).then(res => {
            setCategory(res.data)
        }).catch(err => {
            console.error(err);
            navigate("/404");
        });
    }, []);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/management/dashboard/sold-by-category`, {
                    params: {
                        month: monthPie,
                        year: yearPie
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                console.log("data categpry", res.data);
                const data = [];

                categorys.forEach(category => {
                    const matchingData = res.data.find(item => item.name === category.value);
                    if (matchingData) {
                        data.push({
                            name: category.name,
                            value: matchingData.quantity
                        });
                    } else {
                        data.push({
                            name: category.name,
                            value: 0
                        });
                    }
                });

                if (isMounted) {
                    setDataPieChart(data); // Chỉ cập nhật state nếu component vẫn còn mounted
                }
                console.log(dataPieChart);
                console.log("data categpry", res.data);
            } catch (error) {
                console.error("Error fetching category data", error);
                navigate("/404");
            }
        };

        fetchData();

        return () => {
            isMounted = false; // Cập nhật biến khi component unmount
        };
    }, [monthPie, yearPie]);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const requests = monthsAreaChart.map(month =>
                    axios.get(`${baseUrl}/api/v1/management/dashboard/quatity-order-by-month-year`, {
                        params: {
                            month,
                            year
                        },
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    })
                );

                const responses = await Promise.all(requests);
                const data = responses.map((res, index) => ({
                    name: 'Tháng ' + (index + 1),
                    pv: res.data
                }));

                if (isMounted) {
                    setDataAreaChart(data); // Chỉ cập nhật state nếu component vẫn còn mounted
                }

            } catch (error) {
                console.error("Error fetching order quantity data", error);
                navigate("/404");
            }
        };

        fetchData();

        return () => {
            isMounted = false; // Cập nhật biến khi component unmount
        };
    }, [year]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/management/dashboard/best-selling-products`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setProducts(res.data);
            } catch (error) {
                console.error("Error fetching best-selling products data", error);
                navigate("/404");
            }
        };
        fetchProduct();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/management/dashboard/top-user-selling`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setUsers(res.data);
            } catch (error) {
                console.error("Error fetching top user data", error);
                navigate("/404");
            }
        };
        fetchUser();
    }, []);

    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    return (
        <div style={{background: "#eeeeee"}}>

            <div className="main-content">
                <div className={"mb-3"} style={{width: "10%"}}><Form.Select value={year}
                                                                            aria-label="Default select example"
                                                                            onChange={(e) => setYear(e.target.value)}>
                    {years.map((year) => (
                        <option key={year} value={year}>{year}</option>

                    ))}
                </Form.Select></div>

                <div className="row">
                    <div className="col-12 col-lg-6 col-xl-3">
                        <div className="widget widget-tile">
                            <div className="chart sparkline" id="spark1"><Box sx={{flexGrow: 1}}>
                                <SparkLineChart data={[2, 5, 3, 7, 5, 10, 3, 6, 5, 10]} height={50}
                                                colors={["#83aff8"]}/>
                            </Box></div>

                            <div className="data-info text-right w-50">
                                <div className="desc">Người dùng</div>
                                <div className="value"><span
                                    className="indicator indicator-equal mdi mdi-chevron-right"></span><span
                                    className="number">{userAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6 col-xl-3">
                        <div className="widget widget-tile">
                            <div className="chart sparkline" id="spark2">
                                <Box sx={{flexGrow: 1}}>
                                    <SparkLineChart
                                        plotType="bar"
                                        data={[1, 4, 2, 5, 7, 2, 4, 6, 1, 4, 2, 5, 7, 2, 4, 9]}
                                        height={50}
                                        colors={["#fabc04"]}
                                    />
                                </Box>
                            </div>
                            <div className="data-info text-right w-100">

                                <div className="desc">Doanh thu</div>
                                <div className="value"><span
                                    className="indicator indicator-positive mdi mdi-chevron-up"></span><span
                                    className="number"><strong><CurrencyFormatter value={revenue}/></strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6 col-xl-3">
                        <div className="widget widget-tile">
                            <div className="chart sparkline" id="spark3">
                                <Box sx={{flexGrow: 1}}>
                                    <SparkLineChart data={[2, 5, 3, 7, 5, 10, 3, 6, 5, 10]} height={50}
                                                    colors={["red"]}/>
                                </Box>
                            </div>
                            <div className="data-info">
                                <div className="desc">Đơn hàng</div>
                                <div className="value"><span
                                    className="indicator indicator-positive mdi mdi-chevron-up"></span><span
                                    className="number">{orderAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6 col-xl-3">
                        <div className="widget widget-tile">
                            <div className="chart sparkline" id="spark4">
                                <Box sx={{flexGrow: 1}}>
                                    <SparkLineChart
                                        data={[3, -10, -2, 5, 7, -2, 4, 6]}
                                        height={50}
                                        curve="natural"
                                        area
                                        colors={["#3eac5c"]}
                                    />
                                </Box>
                            </div>
                            <div className="data-info">
                                <div className="desc">Lượt tương tác</div>
                                <div className="value"><span
                                    className="indicator indicator-negative mdi mdi-chevron-down"></span><span
                                    className="number" data-toggle="counter" data-end="113">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="row mr-1 ml-1" style={{background: "#ffff"}}>
                    <div className={"col mt-8"}>
                        {/*<div className={"m-3"} style={{width: "15%"}}><Form.Select value={year}*/}
                        {/*                                                           aria-label="Default select example"*/}
                        {/*                                                           onChange={(e) => setYearAreaChart(e.target.value)}>*/}
                        {/*    {years.map((year) => (*/}
                        {/*        <option key={year} value={year}>{year}</option>*/}

                        {/*    ))}*/}
                        {/*</Form.Select></div>*/}
                        <AreaChart width={600} height={250} data={dataAreaChart}
                                   margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name"/>
                            <YAxis/>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <Tooltip/>

                            <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)"
                                  name={"Đã bán"}/>
                        </AreaChart></div>
                    <div className={"col"}>
                        <div className={"row"}>
                            <div className={"m-3"} style={{width: "20%"}}><Form.Select value={monthPie}
                                                                                       onChange={(e) => setMonthPie(Number(e.target.value))}>
                                {months.map((month) => (
                                    <option key={month} value={month}>
                                        {"Tháng " + month}
                                    </option>
                                ))}
                            </Form.Select></div>
                            <div className={"m-3"} style={{width: "18%"}}><Form.Select value={yearPie}
                                                                                       onChange={(e) => setYearPie(Number(e.target.value))}>
                                {years.map((year) => (
                                    <option key={year} value={year}>{year}</option>

                                ))}
                            </Form.Select></div>
                        </div>
                        <PieChart width={500} height={240}>
                            <Pie
                                data={dataPieChart}
                                cx={230}
                                cy={110}
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                label
                            >
                                {dataPieChart.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                ))}
                            </Pie>
                            <Legend/>
                        </PieChart>
                    </div>
                </div>
                <div className="row mr-1 ml-1" style={{background: "#ffff"}}>
                    <div className="col-12 col-lg-6  mt-8">
                        <div className="card card-table">
                            <div className="card-header " style={{background: "#fff"}}>

                                <div className="title">Top 10 sản phẩm bán chạy</div>
                            </div>
                            <div className="card-body table-responsive">
                                <table className="table table-striped table-borderless">
                                    <thead>
                                    <tr>
                                        <th style={{width: "20%"}} className={"text-center"}>Hình ảnh</th>
                                        <th style={{width: "40%"}} className={"text-center"}>Sản phẩm</th>
                                        <th style={{width: "20%"}} className={"text-center"}>Loại</th>
                                        <th style={{width: "30%"}} className={"text-center"}>Giá</th>
                                        <th style={{width: "15%"}} className={"text-center"}>Số lượng</th>
                                    </tr>
                                    </thead>
                                    <tbody className="no-border-x">
                                    {products.map(product => (
                                        <tr key={product.product.id}>
                                            <td className={"text-center"}><img src={product.product.img1}
                                                                               width={"40%"}/></td>
                                            <td>{product.product.title}</td>
                                            <td>{product.product.category.name}</td>
                                            <td className="number"><CurrencyFormatter
                                                value={product.product.price - product.product.price * (product.product.sale / 100)}/>
                                            </td>
                                            <td className={"text-center"}>{product.totalQuantity}</td>

                                        </tr>
                                    ))}


                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6 mt-8">
                        <div className="card card-table">
                            <div className="card-header" style={{background: "#fff"}}>

                                <div className="title">Top người mua hàng nhiều</div>
                            </div>
                            <div className="card-body table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead>
                                    <tr>
                                        <th style={{width: "37%"}}>Người dùng</th>
                                        <th style={{width: "37%"}}>SĐT</th>
                                        <th style={{width: "36%"}}>Số lần mua</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.map(user => (
                                        <tr key={user.user.id}>
                                            <td className="user-avatar"><img src="/admin/assets/img/avatar.png"
                                                                             alt="Avatar"/>{user.user.fullname}
                                            </td>
                                            <td>{user.user.phoneNumber}</td>
                                            <td>{user.quantity}</td>

                                        </tr>
                                    ))}


                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default Dashboard