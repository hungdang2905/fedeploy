import SearchContext from "./SearchContext";
import {useContext} from "react";
import TextField from '@mui/material/TextField';
import {Autocomplete} from "@mui/material";

const AutoCompleteSearch = () => {
    const { suggestions,setRowData} = useContext(SearchContext);

    return (
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={suggestions}
            onChange={(e,v) => setRowData(v)}
            getOptionLabel={(suggestions) => suggestions.title || ""}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Tìm kiếm sản phầm" />}
        />
    );
};
export default AutoCompleteSearch;
