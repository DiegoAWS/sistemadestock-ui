import React from 'react';

const Dashboard = props => {
    var user= localStorage.UserOficialName

   
    return (


        <div id="ContenidoPrincipal" className="content-wrapper">

    <h1>{user}</h1>
            {/*<!-- Main content-->*/}
            <section className="content">
                <div className="container-fluid">
                    {/*<!-- Small boxes (Stat box)-->*/}
                    <div className="row">
                        <div className="col-lg-3 col-6">
                            {/*<!-- small box-->*/}
                            <div className="small-box bg-info">
                                <div className="inner">
                                    <h3>150</h3>

                                    <p>Nuevos Productos</p>
                                </div>
                                <div className="icon">
                                    <i className="ion ion-bag"></i>
                                </div>
                                <a href="/" className="small-box-footer">Ver Más<i className="fas fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                        {/*<!-- ./col-->*/}
                        <div className="col-lg-3 col-6">
                            {/*<!-- small box-->*/}
                            <div className="small-box bg-success">
                                <div className="inner">
                                    <h3>112<sup>%</sup></h3>

                                    <p>Aumento de las Ventas</p>
                                </div>
                                <div className="icon">
                                    <i className="ion ion-stats-bars"></i>
                                </div>
                                <a href="/" className="small-box-footer">Más Información<i
                                    className="fas fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                        {/*<!-- ./col-->*/}
                        <div className="col-lg-3 col-6">
                            {/*<!-- small box-->*/}
                            <div className="small-box bg-warning">
                                <div className="inner">
                                    <h3>$ 250 520.00</h3>

                                    <p>Ingreso Diario</p>
                                </div>
                                <div className="icon">
                                    <i className="ion ion-person-add"></i>
                                </div>
                                <a href="/" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                        {/*<!-- ./col-->*/}
                        <div className="col-lg-3 col-6">
                            {/*<!-- small box-->*/}
                            <div className="small-box bg-danger">
                                <div className="inner">
                                    <h3>65</h3>

                                    <p>Usuarios Morosos</p>
                                </div>
                                <div className="icon">
                                    <i className="ion ion-pie-graph"></i>
                                </div>
                                <a href="/" className="small-box-footer">Tomar Acciones <i
                                    className="fas fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                        {/*<!-- ./col-->*/}
                    </div>
                    {/*<!-- /.row-->*/}
                    {/*<!-- Main row-->*/}
                   


                </div>



            </section>

        </div>
    )

}
export default Dashboard;