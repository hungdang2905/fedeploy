import {createContext, useEffect, useState} from "react";
import axios from "axios";
import RootPathApi from "../../../route/RootPathApi";
import {useNavigate} from "react-router-dom";

const SearchContext = createContext();
export const SearchProvider = ({ children }) => {
    //value in text search
    const [searchTermLocal, setSearchTermLocal] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [rowData, setRowData] = useState([]);
    const baseUrl =RootPathApi()

    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/search?keyword=${searchTermLocal}`)
            .then(response => {
                setSuggestions(response.data.content);
                console.log(response.data.content);

            })
            .catch(error => {
                console.error('Error searching products:', error);
            });
    }, [searchTermLocal]);


    return (
        <SearchContext.Provider value={{ searchTermLocal, setSearchTermLocal, suggestions, setSuggestions, rowData, setRowData }}>
            {children}
        </SearchContext.Provider>
    );
};
export default SearchContext;