import React from 'react'
import Button from "./Button.jsx";

const Select = ({text, options = [], value, onChange}) => {

    return (
        <div className="flex flex-col flex-1 gap-2">
            <label className="text-left text-base">{text}</label>
            <div className="flex gap-4">
                <select
                    value={value}
                    onChange={onChange}
                    className="cursor-pointer w-full text-xs bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}

                </select>
            </div>
        </div>
    )
}
export default Select
