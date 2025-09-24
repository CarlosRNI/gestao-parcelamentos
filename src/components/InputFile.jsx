import React, { useState } from 'react';

const InputFile = ({ onChange }) => {
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');

    const allowedExtensions = ['xlsx']; // formatos permitidos

    const validateFile = (file) => {
        const extension = file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(extension)) {
            setError(`Formato inválido! Apenas: ${allowedExtensions.join(', ')}`);
            setFileName('');
            return false;
        }
        setError('');
        return true;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && validateFile(file)) {
            setFileName(file.name);
            if (onChange) onChange(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && validateFile(file)) {
            setFileName(file.name);
            if (onChange) onChange(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="flex flex-col flex-1 gap-2">
            <div className="flex items-center justify-center w-full"
                 onDrop={handleDrop}
                 onDragOver={handleDragOver}
            >
                <label htmlFor="dropzone-file"
                       className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {fileName ? (
                            // SVG diferente quando existe fileName
                            <svg
                                className="w-8 h-8 mb-4 text-green-500 dark:text-green-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7" // ícone de check por exemplo
                                />
                            </svg>
                        ) : (
                            // SVG padrão
                            <svg
                                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                            </svg>
                        )}

                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Clique para anexar</span> ou arraste e solte
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">.XLSX</p>
                        {fileName && <p className="text-sm text-green-500 mt-2">Selecionado: {fileName}</p>}
                        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                    </div>

                    <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".xlsx"
                    />
                </label>
            </div>
        </div>
    )
}

export default InputFile;
