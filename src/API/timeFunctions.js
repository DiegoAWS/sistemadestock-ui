   export const dateToString = n =>
            {
                try
                {
                    let day = n.getDate() > 9 ? n.getDate() : '0' + n.getDate()
                    let month = n.getMonth() > 8 ? ( n.getMonth() + 1 ) : '0' + ( n.getMonth() + 1 )
                    let year = n.getFullYear()
                    let hours = n.getHours() > 9 ? n.getHours() : '0' + n.getHours()
                    let minutes = n.getMinutes() > 9 ? n.getMinutes() : '0' + n.getMinutes()

                    return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes
                }
                catch{
                    return dateToString( new Date() )
                }

            }


        export    const stringToDate = s =>
            {
                try
                {
                    let f = s.split( ' ' )
                    let date = f[ 0 ].split( '/' )
                    let time = f[ 1 ].split( ':' )
                    return new Date( date[ 2 ], date[ 1 ] - 1, date[ 0 ], time[ 0 ], time[ 1 ] )
                }
                catch{
                    return new Date()
                }
            }