import utilStyles from '@/styles/utils.module.css';

export default function Story({story, update, quit}) {

    function ready(e) {
        e.preventDefault();

        update("Ready");
    }
    
    return (
        <div className={utilStyles.list}>
            <div className={utilStyles.listItem}>
                <div className={utilStyles.listItemElement}><b>Prompt</b></div>
                <div classNaame={utilStyles.listItemElement}><b>Response</b></div>
            </div>

           {story.map((line, index) => (
                <div key={index} className={utilStyles.listItem}>
                    <div className={utilStyles.listItemElement}>{line.first}</div>
                    <div className={utilStyles.listItemElement}>{line.second}</div>
                </div>
           ))} 
           <button onClick={ready}>Ready</button>
           <button onClick={quit}>Quit</button>
        </div>
    );
}