import {storage} from "./config";
import {uploadBytes,ref, getDownloadURL} from "firebase/storage";

export function upImageFirebase(file, username){

    const imageRef = ref(storage, `comment/${file.name + username}`)
    return new Promise(resolve => (
        //create sub promise
        uploadBytes(imageRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then(url => {
                let a = {name: url}
                resolve(a)
            })
        })
    ))
}