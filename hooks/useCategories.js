import { useState, useEffect } from 'react';
import { getCategories } from '../services';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then((newCategories) => setCategories(newCategories))
      .catch((err) => console.log(err));
  }, []);

  return categories;
};