import React from 'react'

const Search = ( { searchTerm, setSearchTerm }) => {
    return (
        <form>
            <label for="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative w-[50%] mx-auto">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-[#494443] dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="shadow-md sm:rounded-lg block w-full p-4 ps-10 text-sm focus:outline-none text-[#494443] border border-gray-300 rounded-lg bg-gray-50 focus:ring-[#494443] focus:border-[#494443] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#494443] dark:focus:border-[#494443]"
                    placeholder="Digite o nome do cliente para filtrar"
                />
            </div>
        </form>
    )
}
export default Search