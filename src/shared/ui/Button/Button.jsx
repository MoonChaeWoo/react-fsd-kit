const Button = ({children, onClick, type = 'submit', className, formAction}) => {
    return (
        <button
            formAction={formAction}
            onClick={(e) => {onClick?.(e)}}
            className={className || "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"}
            type={type}>
            {children}
        </button>
    );
};

export default Button;