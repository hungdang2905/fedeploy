import {Button, Form, Image, Modal} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {notify} from "../../../util/notify/Notify";
import {deleteImage, handleUpload} from "../../../util/uploadImage/UploadImage";
import CurrencyInput from "react-currency-input-field";
import RootPathApi from "../../../route/RootPathApi";

const ProductManagementUpdate = ({show, onHide, id}) => {
    const [product, setProduct] = useState({});
    const [categorys, setCategorys] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [img1, setImg1] = useState('');
    const [img2, setImg2] = useState('');
    const [price, setPrice] = useState(0);
    const [sale, setSale] = useState(0);
    const [storage, setStorage] = useState(0);
    //validate
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [categoryError, setCategoryError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [storageError, setStorageError] = useState('');
    const [imageError, setImageError] = useState('');
    const accessToken = localStorage.getItem("accessToken");
    const baseUrl = RootPathApi()

    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/category/all`)
            .then(res => setCategorys(res.data))
            .catch(error => console.log("error:", error));

        axios.get(`${baseUrl}/api/v1/product/${id}`)
            .then(res => {
                const productData = res.data;
                setProduct(productData);
                setTitle(productData.title);
                setDescription(productData.description);
                setCategory(productData.category.value);
                setPrice(productData.price);
                setStorage(productData.storage);
                setSale(productData.sale)
                setImg1(productData.img1);
                setImg2(productData.img2);
            })
            .catch(error => console.log("error:", error));
    }, [id]);


    const handleUpdateProduct = async () => {
        if (!title.trim()) {
            setTitleError('Vui lòng nhập tên sản phẩm');
        }
        if (!description.trim()) {
            setDescriptionError('Vui lòng nhập mô tả sản phẩm');
        }
        if (!category) {
            setCategoryError('Vui lòng chọn loại sản phẩm');
        }

        if (price <= 0) {
            setPriceError('Vui lòng nhập giá');
        }
        if (storage <= 0 || !Number.isInteger(storage)) {
            setStorageError('vui lòng nhập số lượng ');
        }
        if (!img1 && !img2) {
            setImageError('Vui lòng chọn ít nhất một hình ảnh');

        }
        if (title !== '' && description !== '' && category !== '' && img1 !== '' && img2 !== '') {
            const data = {
                title: title,
                description: description,
                category: category,
                price: price,
                sale: sale,
                storage: storage,
                img1: img1,
                img2: img2,
            }
            console.log(data)
            await axios.put(`${baseUrl}/api/v1/management/product/update/${id}`, data,{headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }}
            ).then(res => {
                console.log(res.data)
                notify("success","Đã cập nhật sản phẩm")
            }).catch(err => {
                console.log(err)
            })
            handleClose()

        }
    }

    const handleClose = () => {
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} className="text-left">
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <div className="row">
                        <Form.Group className="mb-3 text-left col-6" controlId="category">
                            <Form.Label>Hình ảnh 1</Form.Label>
                            <div>
                                <Image width="90%" src={img1} rounded/>
                            </div>
                            Chọn file
                            <Form.Control
                                type="file"
                                style={{width: "90%"}}
                                onChange={(e) => {
                                    deleteImage(img1);
                                    handleUpload(e.target.files[0], setImg1);
                                }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 text-left col-6" controlId="category">
                            <Form.Label>Hình ảnh 2</Form.Label>
                            <div>
                                <Image width="90%" src={img2} rounded/>
                            </div>
                            Chọn file
                            <Form.Control
                                style={{width: "90%"}}
                                type="file"
                                placeholder="Chọn file"
                                autoFocus
                                onChange={(e) => {
                                    deleteImage(img2);
                                    handleUpload(e.target.files[0], setImg2);
                                }}
                            />
                        </Form.Group>
                        <p className={"text-danger"}>{imageError}</p>
                    </div>
                    <Form.Group className="mb-3 text-left" controlId="title">
                        <Form.Label>Tên sản phẩm</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập tên sản phẩm"
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <p className={"text-danger"}>{titleError}</p>
                    </Form.Group>

                    <div className="row">
                        <Form.Group className="mb-3 text-left col-6" controlId="category">
                            <Form.Label>Loại sản phẩm</Form.Label>
                            <Form.Select onChange={(e) => setCategory(e.target.value)}>
                                <option>Loại</option>
                                {categorys.map((category) => (
                                    <option selected={product.category && product.category.value === category.value}
                                            key={category.id} value={category.value}>{category.name}</option>
                                ))}
                            </Form.Select>
                            <p className={"text-danger"}>{categoryError}</p>

                        </Form.Group>
                        <Form.Group className="mb-3 text-left col-6 pl-0" controlId="category">
                            <Form.Label>Số lượng</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Nhập số lượng sản phẩm"
                                value={storage}
                                onChange={(e) => setStorage(parseInt(e.target.value))}
                            />
                            <p className={"text-danger"}>{storageError}</p>

                        </Form.Group>
                    </div>
                    <div className="row">
                        <Form.Group className="mb-3 text-left col-6" controlId="category">
                            <Form.Label>Giá</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Nhập giá sản phẩm"
                                value={price}
                                onChange={(e) => setPrice(parseInt(e.target.value))}
                            />

                            <p className={"text-danger"}>{priceError}</p>

                        </Form.Group>
                        <Form.Group className="mb-3 text-left col-6 pl-0" controlId="category">
                            <Form.Label>Giảm giá</Form.Label>
                            <Form.Select onChange={(e) => setSale(parseInt(e.target.value))}>
                                <option>Giảm %</option>
                                {[0, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((sale) => (
                                    <option selected={product.sale === sale} key={sale} value={sale}>{sale}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <Form.Group className="mb-3 text-left" controlId="1">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control as="textarea" rows={3} value={description}
                                      onChange={(e) => setDescription(e.target.value)}/>
                    </Form.Group>
                    <p className={"text-danger"}>{descriptionError}</p>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleUpdateProduct}>
                    Cập nhật
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ProductManagementUpdate;
