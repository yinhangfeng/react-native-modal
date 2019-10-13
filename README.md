# react-native-modal

## Example

```tsx
import { Portal } from 'react-native-modal';

class App extends Component {
  render() {
    return (
      <Portal.Host>
        {/* ... */}
      </Portal.Host>
    );
  }
}
```

```tsx
import { Modal } from 'react-native-modal';

const controller = Modal.open({
  component: <AnyComponent />,
  // ...
});

<Modal>
  <AnyComponent />
</Modal>

<Modal>
  {({ controller }) => {
    return (
      <AnyComponent />
    );
  }}
</Modal>
```