import React, { useState } from 'react';
import propTypes from 'prop-types';
import css from './searchbar.module.css';

export const Searchbar = ({ onSubmit }) => {
  const [query, setQuery] = useState('');

  const onInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(event);
    setQuery('');
  };

  return (
    <header>
      <form className={css.form} onSubmit={handleSubmit}>
        <button type="submit" className={css.button}>
          <span className={css.buttonLabel}>Search</span>
        </button>

        <input
          className={css.input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={query}
          onChange={onInputChange}
          name="query"
        />
      </form>
    </header>
  );
};

Searchbar.propTypes = {
  onSubmit: propTypes.func.isRequired,
};

// export class Searchbar extends React.Component{
//   state = {
//     query: '',
//   };
//   onInputChange = event => {
//     this.setState({
//       [event.target.name]: event.target.value,
//     });
//   };

//   render() {
//     const { query } = this.state;
//     const { onSubmit } = this.props;
//     return (
//       <header>
//         <form
//           className={css.form}
//           onSubmit={event => {
//             onSubmit(event);
//             this.setState({ query: '' });
//           }}
//         >
//           <button type="submit" className={css.button}>
//             <span className={css.buttonLabel}>Search</span>
//           </button>

//           <input
//             className={css.input}
//             type="text"
//             autoComplete="off"
//             autoFocus
//             placeholder="Search images and photos"
//             value={query}
//             onChange={this.onInputChange}
//             name='query'
//           />
//         </form>
//       </header>
//     );
//   }
// }
// Searchbar.propTypes={
//   onSubmit:propTypes.func.isRequired
// }