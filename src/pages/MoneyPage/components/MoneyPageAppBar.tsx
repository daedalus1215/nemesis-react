import { BaseAppBar, BaseAppBarProps } from "../../../components/BaseAppBar/BaseAppBar";

const MoneyPageAppBar = (props: BaseAppBarProps) => (
    <BaseAppBar
      {...props}
      sx={{
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-surface)',
        boxShadow: 'none',
        ...(props.sx || {}),
      }}
      title="Money"
    />
  );
  
  export default MoneyPageAppBar;