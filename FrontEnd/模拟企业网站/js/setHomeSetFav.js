//???ղ?

function AddFavorite(sURL, sTitle)
{
    
    sURL = encodeURI(sURL);
    try
    {
        
        window.external.addFavorite(sURL, sTitle);
        
    }
    catch (e)
    {
        
        try
        {
            
            window.sidebar.addPanel(sTitle, sURL, "");
            
        }
        catch (e)
        {
            
            alert("???ղ???ܣ??ʹ?Ctrl+D????????ֶ??????????.");
            
        }
        
    }
    
}

//?Ϊ?ҳ

function SetHome(url)
{
    
    if (document.all)
    {
        
        document.body.style.behavior = 'url(#default#homepage)';
        
        document.body.setHomePage(url);
        
    }
    else
    {
        
        alert("????????????֧??Զ???ҳ?Ϊ?ҳ???,????????????ø???Ϊ?ҳ!");
        
    }
    
}
