import React, { useEffect, useState } from 'react';
import css from './app.module.css';
import { Modal } from './modal/Modal';
import { ImageGallery } from './imageGallery/ImageGallery';
import { Button } from './button/Button';
import { fetchPictures } from 'services/api';
import { Searchbar } from './searchbar/Searchbar';
// import { ThreeDots } from 'react-loader-spinner';
import { Loader } from './loader/Loader';

export const App = () => {
  const [modal, setModal] = useState({ isOpen: false, picture: null });
  const [pictures, setPictures] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [allPicturesLoaded, setAllPicturesLoaded] = useState(false);

  const onSubmit = async event => {
    event.preventDefault();
    const query = event.target.elements.query.value.trim();
    setQuery(query);
    setPage(1);
    setPictures([]);
    setAllPicturesLoaded(false);
  };
  const onCloseModal = () => {
    setModal({ isOpen: false, picture: null });
  };
  const openModal = pic => {
    setModal({ isOpen: true, picture: pic });
  };
  const onLoadMore = () => {
    setPage(page + 1);
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const newPictures = await fetchPictures(query, page);
        
        setPictures(prevPictures => [...prevPictures, ...newPictures]);
        if (newPictures.length === 0) {
          setAllPicturesLoaded(true);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (query !== '' || page !== 1) {
      fetchData();
    }
  }, [query, page]);
  useEffect(() => {
    if (pictures.length === 0 && allPicturesLoaded) {
      setError('No pictures found for this search query.');
    }
  }, [pictures, allPicturesLoaded]);
  return (
    <>
      <Searchbar onSubmit={onSubmit}></Searchbar>
      <div className={css.App}>
        {pictures.length > 0 && (
          <ImageGallery
            pictures={pictures}
            onImgClick={openModal}
          ></ImageGallery>
        )}

        {modal.isOpen && (
          <Modal pic={modal.picture} onCloseModal={onCloseModal}></Modal>
        )}
        {isLoading && <Loader></Loader>}

        {error && (
          <>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
          </>
        )}

        {!error && pictures.length > 0 && (
          <ImageGallery pictures={pictures} onImgClick={openModal} />
        )}

        {!error && pictures.length > 0 && !allPicturesLoaded && (
          <Button text="Load More" onButtonClick={onLoadMore} />
        )}

        {!error && allPicturesLoaded && (
          <>
            <h3>Oops! All pictures are loaded</h3>
            <Button text="Scroll to top" onButtonClick={scrollToTop} />
          </>
        )}
      </div>
    </>
  );
};
