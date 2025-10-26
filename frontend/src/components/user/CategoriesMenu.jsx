import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';

function CategoriesMenu() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/danhmuc');
                setCategories(response.data);
            } catch (error) {
                console.error("There was an error fetching the categories:", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="categories-menu-wrapper p-4 border-t border-b mt-2">
            <nav className="categories-menu-list flex flex-row items-center space-x-2 md:space-x-8 justify-center">
                <ul className="flex space-x-2 md:space-x-10">
                    {categories.map((category) => (
                        <li key={category._id} className="list-none">
                            <NavLink
                                to={`/categories/${category.tenDM.replace(/\s+/g, '-')}?loc=phobien&trang=1`}
                                state={{
                                    id: category._id,
                                    tenDM: category.tenDM,
                                }}
                                className={({ isActive }) =>
                                    `text-lg uppercase hover:text-pink-600 hover:border-b-4 hover:border-pink-600 hover:pb-4
                                    ${isActive ? 'text-pink-600 border-b-4 border-pink-600 pb-4' : 'text-gray-800'}`
                                }
                            >
                                {category.tenDM}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

export default CategoriesMenu;
