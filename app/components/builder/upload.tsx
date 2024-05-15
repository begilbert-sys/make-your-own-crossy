import { useRouter } from 'next/navigation';
import { useState, useContext } from 'react';

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import UploadIcon from '@mui/icons-material/Upload';

import styles from '@/styles/Builder.module.css';

import { Crossy, CrossyJSON } from "@/app/types/crossy";

import { CrossyJSONContext, ICrossyJSONContext } from '@/app/contexts/crossyjsoncontext';

import { styled } from '@mui/material';

enum UploadError  {
    NONE   = "",
    TITLE  = "Your board is missing a title!",
    AUTHOR = "Your board is missing an author!",
    BOARD  = "Your board is not entirely filled in!",
    CLUES  = "Your board is missing one of its clues!"
}

function verifyCrossword(crossyJSON: CrossyJSON): UploadError {
    if (crossyJSON.title === "") {
        return UploadError.TITLE;
    }
    else if (crossyJSON.author === "") {
        return UploadError.AUTHOR;
    }
    else if (crossyJSON.boardString.includes(Crossy.BLANK)) {
        return UploadError.BOARD;
    }
    else if (crossyJSON.acrossClues.includes("") || crossyJSON.acrossClues.includes("")) {
        return UploadError.CLUES;
    } 
    else {
        return UploadError.NONE;
    }
}

export default function Upload() {
    const {crossyJSON, setCrossyJSON} = useContext<ICrossyJSONContext>(CrossyJSONContext);
    const [modalError, setModalError] = useState<UploadError>(UploadError.NONE);
    const router = useRouter();
    const handleBoardUpload = async () => {
        const crossyError = verifyCrossword(crossyJSON);
        if (crossyError != UploadError.NONE) {
            setModalError(crossyError);
            console.log(crossyJSON);
            return;
        }
        const res = await fetch("/api/", {
            method: "POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify(crossyJSON)
        });
        if (!res.ok) {
            console.error(res);
            throw new Error(`Something went wrong with response`);
        }
        const hexID = await res.text();
        router.push("/mini/" + hexID);
    }

    return (
        <>
        <Button
            sx={{backgroundColor: "green"}}
            variant="contained" 
            onClick={() => handleBoardUpload()}
        >
            UPLOAD BOARD
            <UploadIcon />
        </Button>

        <Modal
            open={(modalError != UploadError.NONE)}
            onClose={() => setModalError(UploadError.NONE)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div className={styles.modalError}>
                <h2 id="modal-modal-title">Upload Error</h2>
                <p id="modal-modal-description">{modalError}</p>
            </div>
        </Modal>
        </>
    );
}