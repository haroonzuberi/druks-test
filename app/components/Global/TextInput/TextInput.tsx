import React from 'react'
type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
}
const TextInput = ({ label, error, id, ...props }: Props) => {
    return (
        <div>
            <label htmlFor={id} className="block text-gray-800 text-sm font-semibold"
            >{label}</label>

            <div className="mt-2">
                <input
                    id={id}
                    className={`block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset
                            placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                            ${error
                            ? "ring-red-500 focus:ring-red-600"
                            : "ring-gray-300 focus:ring-blue-600"}`}

                            {...props}

                />
            </div>
             
        </div>
    )
}

export default TextInput
