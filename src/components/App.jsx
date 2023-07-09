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
        // if(!newPictures.every(pic=>pictures.includes(pic))){
        //   setPictures( [...pictures, ...newPictures]);
        // }
        setPictures([...pictures, ...newPictures]);
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

// export class App extends React.Component {
//   state = {
//     modal: { isOpen: false, picture: null },
//     pictures: [],
//     query: '',
//     error: null,
//     isLoading: false,
//     page: 1,
//     allPicturesLoaded: false,
//   };

//   onSubmit = async event => {
//     event.preventDefault();
//     const query = event.target.elements.query.value.trim();
//     this.setState({ query, page: 1, pictures: [], allPicturesLoaded: false });
//     // this.setState({page:1})
//   };

//   onCloseModal = () => {
//     this.setState({ modal: { isOpen: false, picture: null } });
//   };

//   openModal = pic => {
//     this.setState({ modal: { isOpen: true, picture: pic } });
//   };
//   onLoadMore = () => {
//     this.setState(prevState => ({
//       page: prevState.page + 1,
//     }));
//   };
//   scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   async componentDidUpdate(prevProps, prevState) {
//     if (
//       prevState.query !== this.state.query ||
//       prevState.page !== this.state.page
//     ) {
//       try {
//         this.setState({ isLoading: true });

//         const newPictures = await fetchPictures(
//           this.state.query,
//           this.state.page
//         );
//         this.setState(prevState => ({
//           pictures: [...prevState.pictures, ...newPictures],
//         }));

//         if (newPictures.length === 0) {
//           this.setState({ allPicturesLoaded: true });
//         }
//       } catch (error) {
//         this.setState({
//           error: error.message,
//         });
//       } finally {
//         this.setState({ isLoading: false });
//       }
//     }
//   }

//   render() {
//     return (
//       <>
//         <Searchbar onSubmit={this.onSubmit}></Searchbar>
//         <div className={css.App}>
//           {this.state.pictures.length > 0 && (
//             <ImageGallery
//               pictures={this.state.pictures}
//               onImgClick={this.openModal}
//             ></ImageGallery>
//           )}

//           {this.state.modal.isOpen && (
//             <Modal
//               pic={this.state.modal.picture}
//               onCloseModal={this.onCloseModal}
//             ></Modal>
//           )}
//           {this.state.isLoading && <Loader></Loader>}

//           {this.state.pictures.length > 0 && !this.state.allPicturesLoaded && (
//             <Button text="Load More" onButtonClick={this.onLoadMore} />
//           )}
//           {this.state.allPicturesLoaded && (
//             <>
//               <h3>Oops! All pictures are loaded</h3>
//               <Button
//                 text="Scroll to top"
//                 onButtonClick={this.scrollToTop}
//               ></Button>
//             </>
//           )}
//           {this.state.error && <h3>Oops! Something went wrong</h3>}
//         </div>
//       </>
//     );
//   }
// }
