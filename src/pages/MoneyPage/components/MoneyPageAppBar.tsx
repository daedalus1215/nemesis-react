import { BaseAppBar } from "../../../components/BaseAppBar/BaseAppBar";

const MoneyPageAppBar = (props: any) => (
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