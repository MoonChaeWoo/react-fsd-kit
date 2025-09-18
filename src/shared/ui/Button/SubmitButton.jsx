import { useFormStatus } from "react";

const SubmitButton = ({children = '요청', onClick, type = 'submit', className}) => {
    const { pending } = useFormStatus();

    return (
        <button
            disabled={pending}
            onClick={(e) => {onClick?.(e)}}
            className={className || "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"}
            type={type}>
            {pending ?  '...요청중' : children}
        </button>
    );
};

export default SubmitButton;