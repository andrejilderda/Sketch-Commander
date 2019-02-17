
class ContextSelector {
    constructor() {
        this.context = 0;
        this.tabDown = false;
        this.active = false;
        this.tabs = [ 'Artboard', 'Page', 'Document' ];
        this.element = document.querySelector( '.c-context-tabs' );
        this.template = function() {
            return `
                ${this.tabs.map( (tab, index) => `
                <li class="c-context-tabs__item  ${index === this.context  ? `is-active` : ``}">
                    ${tab}
                </li>
                `).join('')}
            `
        }
        this.render();
    }

    render() {
        if ( this.active ) this.element.classList.add( 'is-active' );
        else this.element.classList.remove( 'is-active' );
        this.element.innerHTML = `${ this.template() }`;
    }
    
    onTabPress( e ) {
        if (!e.shiftKey) this.switch();
        else this.switch( -1 );
    }

    // for switching task contexts
    switch( value ) {
        if ( !arguments.length ) value = +1;
        let newContext = this.context + value;
        
        const length = this.tabs.length;
        this.context = mod(newContext, length);
        
        if ( !BROWSERDEBUG ) returnToSketch('saveContext', this.context);
        this.render();
    }
}

const contextTabs = new ContextSelector();
