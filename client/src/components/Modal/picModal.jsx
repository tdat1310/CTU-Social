import React from 'react'
import { Button, Grid, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import PicWrap from './input/picWrap';
const PicModal = ({isOpen, onClose, items , onDelete}) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={'3xl'}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Danh sách ảnh</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
              {items.length > 0 ? items.map((src, index) => (
                <PicWrap src={src} onDelete={onDelete} id={index} key={index} />
              )) : onClose()}
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default PicModal