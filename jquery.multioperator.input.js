(function ( $ ) {

    $.fn.multioperator = function(options) {
        var settings = $.extend({
            keyPress: 13,
            isMoney: true,
            decimals: 2,
            comma: true
        }, options);

        var sumRes = new RegExp(/\-|\+/);
        var percent = new RegExp(/\%/);
        var multDiv = new RegExp(/\/|\*|[x]/i);

        // add an white space
        $( this ).on('focusin', function() {
            var val = $( this ).val().trim();
            if(val != '' ){
                $( this ).val( val + ' ' );
            }
        });

        // delete the white spaces
        $( this ).on('focusout', function() {
            $( this ).val( $( this ).val().trim() );
        });

        function getPercent( out, strng ) {
            var val = parseFloat( strng );
            if( !val ) return 0;
            val = Math.abs( val );
            var per = out * ( val / 100 );
            val = /\-/.test( strng ) ? out - per : out + per;
            return val;
        }

        function getAmount( out, strng ) {
            var val = parseFloat( strng );
            if( !val ) return 0;
            return out + val;
        }

        function mutlDivOp( out, strng ) {
            var val = strng.replace( multDiv, '' );
            val = parseFloat( val );
            if( !val ) return;
            if( /\*|[x]/i.test( strng ) ) {

                return ( out * val );

            } else if(/\//.test( strng )) {
                return ( out / val );
            }
        }

        function parse( orgnl, strng, out ) {
            if( multDiv.test(strng) ) {

                return mutlDivOp( out, strng );

            }else if( percent.test( strng ) && sumRes.test( strng ) ) {

                return getPercent( out, strng );

            } else if( sumRes.test( strng ) && !percent.test( strng ) ) {

                return getAmount( out, strng );

            } else {

                return orgnl;
            }
        }

        // Add commas to integger side
        function parseCommas( val ) {
            val = val.split( '.' );
            val[0] = val[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return val.join( '.' );
        }

        $( this ).on( 'keydown', function( e ) {
            if( e.keyCode !== settings.keyPress ) {
                return;
            }
            var oText = $(this).val();
            var noMoney = oText.replace( '$','' ).replace( ',','' );
            var arr = noMoney.split( ' ' );
            var orgnl = parseFloat( arr[0] );
            if( !orgnl ) return;
            var out = parseFloat( orgnl );
            for( i in arr) {
                if( arr[i] != '' && i != 0 ) {
                    console.log(out, arr[i]);
                    // if( sumRes.test(arr[i]) ) {
                        // out += parse( orgnl, arr[i] );
                    // } else {
                        out = parse( orgnl, arr[i], out );
                    // }
                    console.log(out);

                }
            }
            out = out.toFixed( settings.decimals );
            if( settings.comma ) out = parseCommas( out );
            if( settings.isMoney ) out = '$' + out;
            $( this ).val( out + ' ' );
        });
    }

}( jQuery ));
