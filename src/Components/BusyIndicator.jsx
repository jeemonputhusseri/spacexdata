import React, { PureComponent } from 'react';

class BusyIndicator extends PureComponent {
    render() {
        if (this.props.status) {
            return (
                <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            )
        }
        return ( <div/>)        
    }
}

export default BusyIndicator;
