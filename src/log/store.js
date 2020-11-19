class Store {
    constructor() {
        this.usingComponentsMap = {};
        this.renamedComponents = {};
        this.needSwanIdComponents = [];
        this.relationComponentsParent = {}; // {a:['com1','com1],b:[]}
        this.relationComponentsChild = []; // {a:['com1','com1],b:[]}
    }


    dispatch({action, payload = {}}) {
        let key = '';
        switch (action) {
            case 'usingComponentsMap':
                this.usingComponentsMap = payload;
                break;
            case 'renamedComponents':
                this.renamedComponents = payload;
                break;
            case 'needSwanIdComponents':
                this.needSwanIdComponents.push(payload);
                break;
            case 'relationComponentsParent':
                key = Object.keys(payload)[0];
                this.relationComponentsParent[key] = payload[key];
                break;
            case 'relationComponentsChild':
                key = Object.keys(payload)[0];
                this.relationComponentsChild[key] = payload[key];
                break;
            default:
                throw new Error('action未定义，行为禁止');
        }
    }
}

module.exports = new Store();
