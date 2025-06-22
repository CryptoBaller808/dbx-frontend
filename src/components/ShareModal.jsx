import React, { useState } from 'react'
import { Card } from 'react-bootstrap'
import { useLocation } from 'react-router-dom';
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon, LinkedinShareButton, LinkedinIcon } from 'react-share';
import { CrossIcon } from '../Icons';

const ShareModal = ({ setShareLinkModal, shareLinkModal }) => {
    const currentUrl = window.location.href;
    const [success, setSuccess] = useState(false);

    // handle copy to clipboard 
    const handleCopy = async () => {
        setSuccess(false);
        await navigator.clipboard.writeText(currentUrl);
        setSuccess(true);
    }

    // handle close 
    const handleClose = () => {
        setShareLinkModal(false);
    }

    return (
        <div className='swapTransModal'>
            <Card className='swapModal-card shadow-lg py-3'>
                <Card.Body>
                    <div className="d-flex justify-content-end">
                        <p className='mb-0 cursor-pointer text-danger' onClick={handleClose}><CrossIcon className="cursor-pointer"/></p>
                    </div>
                    {success && <div className='mb-2 py-2 text-center bg-light rounded'>
                        <p className='mb-0 text-success'>Copied To Clipboard</p>
                    </div>}
                    <Card.Title className='mb-2 text-left'>Share</Card.Title>
                    <hr className='mb-4 mt-0' />

                    <div className="d-flex mb-4">
                        <FacebookShareButton
                            url={currentUrl}
                            quote={'Share Nft Online'}
                            hashtag="#digitalBlockExchange"
                            className='me-3'
                        >
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>

                        <TwitterShareButton
                            url={currentUrl}
                            quote={'Share Nft Online'}
                            hashtag="#digitalBlockExchange"
                            className='me-3'
                        >
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>

                        <WhatsappShareButton
                            url={currentUrl}
                            quote={'Share Nft Online'}
                            hashtag="#digitalBlockExchange"
                            className='me-3'
                        >
                            <WhatsappIcon size={32} round />
                        </WhatsappShareButton>

                    </div>
                    <div className='flex justify-content-between'>
                        <input type="text" className='form-control me-3' disabled value={currentUrl} />
                        <button className='btn btn-primary btn-sm' onClick={handleCopy}>Copy</button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default ShareModal