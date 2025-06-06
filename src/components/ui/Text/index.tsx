interface BaseTextProps {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  className?: string;
}
type TextProps = BaseTextProps & { children: React.ReactNode };

const Text: React.FC<TextProps> = ({ type, className = '', children }) => {
  let defaultClassName = 'font-archivo text-base';
  defaultClassName = `${defaultClassName} ${className}`;

  switch (type) {
    case 'h1':
      return <h1 className={defaultClassName}>{children}</h1>;
    case 'h2':
      return <h2 className={defaultClassName}>{children}</h2>;
    case 'h3':
      return <h3 className={defaultClassName}>{children}</h3>;
    case 'h4':
      return <h4 className={defaultClassName}>{children}</h4>;
    case 'h5':
      return <h5 className={defaultClassName}>{children}</h5>;
    case 'h6':
      return <h6 className={defaultClassName}>{children}</h6>;
    case 'p':
      return <p className={defaultClassName}>{children}</p>;
    case 'span':
      return <span className={defaultClassName}>{children}</span>;
    default:
      return '';
  }
};

export default Text;
