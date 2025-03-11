function Logo() 
{
    return (
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center">
          <div className="relative w-20 h-20 mr-2">
            <img src="src/logo.png" alt="Mahayogam Logo" className="w-full h-full object-contain" />
         </div>
            <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-secondary"></h1>
            <p className="text-sm text-secondary"></p>
          </div>
        </div>
      </div>
     )
    }  
  export default Logo
  