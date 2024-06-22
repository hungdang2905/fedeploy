import React from "react";

const Category = ({ filterProducts }) => {

    const category =({ty})=>{
        console.log(ty)
    }

    return (
        <div>
            <div className="electronics mb-40">
                <h3 className="sidebar-title">Category</h3>
                <div id="shop-cate-toggle" className="category-menu sidebar-menu sidbar-style">
                    <ul>
                        <li className="has-sub"><button className="nav-link" onClick={category("all")}>ALL</button></li>
                        <li className="has-sub"><button className="nav-link" onClick={() => filterProducts('LAPTOP')}>LAPTOP</button></li>
                        <li className="has-sub"><button className="nav-link" onClick={() => filterProducts('RAM')}>RAM</button></li>
                        <li className="has-sub"><button className="nav-link" onClick={() => filterProducts('MOUSE')}>MOUSE</button></li>
                        <li className="has-sub"><button className="nav-link" onClick={() => filterProducts('KEYBOARD')}>KEYBOARD</button></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
export default Category;
