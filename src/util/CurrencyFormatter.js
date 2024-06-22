// components/CurrencyFormatter.js
import React from 'react';
import numeral from 'numeral';

const CurrencyFormatter = ({value}) => {
    const formattedValue = numeral(value).format('0,0') ;

    return <span>{formattedValue}</span>;
};

export default CurrencyFormatter;
