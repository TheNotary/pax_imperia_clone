import React, { useContext } from 'react';
import './Modal.css';
import ChatLobby from 'src/features/ChatLobby/ChatLobby';
import ModalMessage from './ModalMessage';
import { ModalContext } from 'src/app/ModalContextProvider';
import Planet from 'src/features/game/Planet/Planet';


const Modal = () => {
    const ref = React.createRef();
    const { modal } = useContext(ModalContext);

    const closeModal = () => {
        // So this gets setup whenever msgBox is called... yw!
        if (window.modalCb) {
            window.modalCb();
            window.modalCb = null;
        }

        ref.current.style.display = 'none';
        window.modalShown = false;
    };

    const modalContentClicked = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const modalSwitch = () => {
        switch (modal.type) {
            case 'CHAT_LOBBY':
                return (
                    <ChatLobby closeModal={closeModal} />
                );
            case 'MESSAGE':
                return (
                    <ModalMessage message={modal.message} onClose={closeModal} />
                );
            case 'OBJECT_INFO':
                return (
                    <Planet entity={modal.objectInfoEntity} onClose={closeModal} />
                );
            default:
                return (
                    <div>Unknown modal type</div>
                );
        }
    };

    return (
        <div ref={ref} id="modal" onClick={closeModal}>
            <div className="content-wrap" onClick={modalContentClicked}>

                { modalSwitch() }

            </div>

        </div>
    );
};

export default Modal;
