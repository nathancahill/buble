import Node from '../Node.js';
import deindent from '../../utils/deindent.js';

export default class ClassDeclaration extends Node {
	initialise () {
		this.name = this.id.name;
		this.findScope( true ).addDeclaration( this.id, 'class' );

		super.initialise();
	}

	transpile ( code ) {
		const superName = this.superClass && this.superClass.name;

		const indentation = this.getIndentation();
		const indentStr = code.getIndentString();

		const intro = this.superClass ?
			`var ${this.name} = (function (${superName}) {\n${indentation}${indentStr}` :
			`var ${this.name} = `;

		const outro = this.superClass ?
			`\n\n${indentation}${indentStr}return ${this.name};\n${indentation}}(${superName}));` :
			``;

		code.remove( this.start, this.body.start );
		code.insert( this.start, intro );

		this.body.transpile( code, !!this.superClass );

		code.insert( this.end, outro );

		if ( !this.superClass ) deindent( this.body, code );
	}
}
