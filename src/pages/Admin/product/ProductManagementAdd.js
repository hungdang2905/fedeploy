import {Button, Form, Image, Modal} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {deleteImage, handleUpload} from "../../../util/uploadImage/UploadImage";
import {notify} from "../../../util/notify/Notify";
import RootPathApi from "../../../route/RootPathApi";

const ProductManagementAdd = ({show, onHide}) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')

    const [img1, setImg1] = useState('');
    const [img2, setImg2] = useState('');
    const [categorys, setCategorys] = useState([])
    const [price, setPrice] = useState(0)
    const [storage, setStorage] = useState(0)
    const [sale, setSale] = useState(0)

    //validate
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [categoryError, setCategoryError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [storageError, setStorageError] = useState('');
    const [imageError, setImageError] = useState('');
    const accessToken = localStorage.getItem("accessToken");
    const baseUrl = RootPathApi()

    const handleClose = () => {
        onHide();
    };
    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/category/all`).then(res => {
            setCategorys(res.data)
            console.log(categorys)
        }).catch(error => {
            console.log("error:" + error)
        })
    }, []);
    useEffect(() => {

    }, [img1, img2]);

    const handleAddProduct = async () => {
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
        if (storage <=0 || !Number.isInteger(storage)) {
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
            await axios.post(`${baseUrl}/api/v1/management/product/add`, data,{headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }}
            ).then(res => {
                notify("success","Đã thêm sản phẩm")
                console.log(res.data)
            }).catch(err => {
                console.log(err)
            })
            handleClose()
        }

    }

    return <div>

        <Modal show={show} onHide={handleClose} className={"text-left"}>
            <Modal.Header closeButton>
                <Modal.Title>Thêm sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <div className="row">
                        <Form.Group className="mb-3 text-left col-6" controlId="category">
                            <Form.Label>Hình ảnh 1</Form.Label>
                            <div><Image width={"90%"} src={img1} rounded/></div>
                            Chọn file
                            <Form.Control
                                type="file"
                                style={{width: "90%"}}
                                onChange={
                                    (e) => {
                                        deleteImage(img1);
                                        handleUpload(e.target.files[0], setImg1);
                                    }
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 text-left col-6" controlId="category">
                            <Form.Label>Hình ảnh 2</Form.Label>
                            <div><Image width={"90%"} src={img2} rounded/>
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
                                    <option key={category.id} value={category.value}>{category.name}</option>

                                ))}
                            </Form.Select>
                            <p className={"text-danger"}>{categoryError}</p>

                        </Form.Group>
                        <Form.Group className="mb-3 text-left col-6 pl-0" controlId="category">
                            <Form.Label>Số lượng</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Nhập số lượng sản phẩm"
                                autoFocus
                                onChange={(e) => setStorage(parseInt(e.target.value))}
                            />
                            <p className={"text-danger"}>{storageError}</p>

                        </Form.Group>
                    </div>
                    <div className="row">
                        <Form.Group className="mb-3 text-left col-6" controlId="category">
                            <Form.Label>Giá</Form.Label>
                            {/*<CurrencyFormat thousandSeparator={true} renderText={value => <div>{value}</div>}/>*/}
                            <Form.Control
                                type="number"
                                placeholder="Nhập giá sản phẩm"
                                autoFocus
                                onChange={(e) => setPrice(parseInt(e.target.value))}
                            />
                            <p className={"text-danger"}>{priceError}</p>

                        </Form.Group>
                        <Form.Group className="mb-3 text-left col-6 pl-0" controlId="category">
                            <Form.Label>Giảm giá</Form.Label>
                            <Form.Select onChange={(e) => setSale(parseInt(e.target.value))}>
                                <option selected={true}>0</option>
                                {[10, 15, 20, 25, 30, 35, 40, 45, 50].map((sale) => (
                                    <option key={sale} value={sale}>{sale}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <Form.Group
                        className="mb-3 text-left"
                        controlId="1"
                    >
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control as="textarea" onChange={(e) => setDescription(e.target.value)} rows={3}/>
                        <p className={"text-danger"}>{descriptionError}</p>

                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleAddProduct}>
                    Thêm
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
}
export default ProductManagementAdd