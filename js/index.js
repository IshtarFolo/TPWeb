/*======================================================
=**************** LES VARIABLES DU QUIZ ****************=   
========================================================*/

/*Variables pour l'intro
===========================*/
//Pour le bouton servant à commencer le quiz
let boutonIntro = document.querySelector('button.boutonIntro');
let intro = document.querySelector('main.intro');

/*Variables pour le quiz et les questions
===========================================*/
//Pour le numéro de la question choisi au hasard
let noQuestion = Math.floor(Math.random()*questions.length);
//Variable contenant la zone du quiz
let Quiz = document.querySelector('main.quiz');
//Variable pour le titre des questions
let titre = document.querySelector('.titreQuestion');
//Pour le nombre de bonnes réponses trouvées par le joueur
let nombreBonnesReponses;
//Pour les choix de réponse
let choixDeReponses = document.querySelector('.choixReponse');
//On récupère la div servant à contenir l'image reliée à la question affichée
let imageReference = document.querySelector('.image');

/*Variables pour la fin
=========================*/
//Pour capturer les rideaux qui sont sur la page de fin
let rideauFin = document.querySelector('.rideauFin');
//On capture la balise main de la fin
let pageFin = document.querySelector('.fin');
//On capture le bouton pour recomencer
let boutonFin = document.querySelector('.boutonRecommencer');

/*Variables pour la barre d'avancement
=========================================*/
let barreChrono = document.querySelector('.barreTemps');
let largeurBarre = 96.5;//Taille de base de la barre de temps
let questionCommence = false;//Variable qui empêche de créer une erreur avec les animations des rideaux 

/*Variables pour les deux divs servant de rideau
=====================================================*/
let rideauGauche = document.querySelector('.rideau1');
let rideauDroite = document.querySelector('.rideau2');
//Les positions X de base des 2 rideaux
let positionXRideau1 = 0;
let positionXRideau2 = 0;
//Pour capturer le conteneur des rideaux
let conteneurRideaux = document.querySelector('.rideauFin');

/*Variable historique
=========================*/
//On initie la variable historique à la fonction qui récupère le tableau du local storage
let historique = recupererHistorique();

/*Variables pour le style du curseur
========================================*/
//Pour la personalisation du curseur
let leRoot = document.querySelector(':root');
//On ajoute un écouteur d'évènement  sur le curseur
document.addEventListener('mousemove', deplacerCurseur);
//On associe la div .curseur à la variable leCurseur
let leCurseur = document.querySelector('.curseur');
//on ajoute un écouteur d'évènements pour le survol du bouton d'intro
boutonIntro.addEventListener('mouseover', changerApparenceCurseur);
boutonIntro.addEventListener('mouseout', changerApparenceCurseur);

/*======================================================
=*************** LES ÉVÈNEMENTS DU QUIZ ***************=   
========================================================*/
//Pour démarrer le quiz
boutonIntro.addEventListener('click', debuterQuiz);

/*======================================================
=************** LES FONCTIONS DU CURSEUR **************=   
========================================================*/
//Fonction qui gère le déplacement du curseur
function deplacerCurseur(event){
    //On suit les mouvements de la souris et on passe ses valeurs à la propriété --mouseX et --mouseY du root
    //Ainsi le curseur personnalisé suit la souris
    leRoot.style.setProperty('--mouseX', event.clientX + 'px');
    leRoot.style.setProperty('--mouseY', event.clientY + 'px');
}

//Fonction qui gère le changement d'apparence du curseur
function changerApparenceCurseur(event){
    //Si il y a survol...
    if(event.type == 'mouseover')
    {
        leCurseur.style.borderRadius = "0";
        leCurseur.classList.add("anim");
    }
    //Sinon...
    else
    {
        leCurseur.style.borderRadius = "50%";
        leCurseur.classList.remove("anim");
    }
}

 function recupererHistorique() {
     //On vérifie si un historique est présent dans le local storage
    let historiqueReponses = localStorage.getItem("historiqueQuiz");
    //L'historique est transformé en tableau vide et on lui attribue un tableau appelé scores et contenant 0 points
    return JSON.parse(historiqueReponses) || [{scores:[0]}];
 }

/*======================================================
=**************** LES FONCTIONS DU QUIZ ***************=   
========================================================*/

/*Quand le joueur appuie sur le bouton et que le quiz commence
===================================================================*/

function debuterQuiz(event){
    //On crée un item dans le local storage appelé score qui sera à 0 en partant
    nombreBonnesReponses = localStorage.getItem("score") || 0;
    //On crée un nouveau tableau des scores pour utilisation ultérieure
    historique.push({scores: []});
    //On transforme le tableau en string pour le localStorage
    localStorage.setItem("historiqueQuiz", JSON.stringify(historique));

    //On récupère le conteneur de l'intro et on enlève l'intro de l'affichage
    intro.style.display = "none";
    //On appelle la fonction qui affiche la premiere question
    afficherQuestions();
}

/*Pour animer le rideau fait à l'aide de divs
====================================================================*/
//---Pour ouvrir le rideau---
function ouvrirRideaux(event) {
    //On augmente la positionX de 0.1
    positionXRideau1 += 0.1;
    //On diminue la positionX de 0.1
    positionXRideau2 -= 0.1;
    //On associe les bonnes valeurs aux deux pans de rideaux
    rideauDroite.style.transform = `translateX(${positionXRideau1}rem)`;
    rideauGauche.style.transform = `translateX(${positionXRideau2}rem)`;
    //Si la positionX du premier rideau est plus petite que 100 et que la positionX du deuxième est plus grande que 100..
    if (positionXRideau1 < 50 && positionXRideau2 > -50)
    {
        //On fait jouer l'animation d'ouverture
        requestAnimationFrame(ouvrirRideaux);
    }
    else
    {
        //La question commence et donc elle passe à true
        questionCommence = true;
    }
    //Si la question est à true on enlève la classe clique sur les choix de réponse et le joueur peut commencer à répondre à la question
    if (questionCommence == true)
    {
        //On met la classe clique aux choix pour empêcher le joueur de cliquer sur un autre choix une fois qu'il en a fait un premier
        choixDeReponses.classList.toggle("clique");
    }
    //Si la position des rideaux est rendue au maximum on part le chronomètre pour la question
    if (positionXRideau1 >= 50 && positionXRideau2 <= -50)
    {
        tempsPasse();
    }
}

//---Pour fermer le rideau---
function fermerRideaux() {
    //On fait l'inverse de la fonction précédente avec les positions X des pans du rideau
    positionXRideau1 -= 0.1;
    positionXRideau2 += 0.1;
    //On passe les valeurs des variables des positionsX aux deux rideaux servant à la transition entre les questions
    rideauDroite.style.transform = `translateX(${positionXRideau1}rem)`;
    rideauGauche.style.transform = `translateX(${positionXRideau2}rem)`;
    
    //Si les 2 pans de rideaux ne sont pas rendus à la position 0
    if (positionXRideau1 > 0 && positionXRideau2 < 0)
    {
        //On fait jouer l'animation
        requestAnimationFrame(fermerRideaux);
        //La variable questionCommence est fausse et donc la classe clique est activée
        questionCommence = false;
    }
    else 
    {
        //Sinon on passe à la question suivante
        questionSuivante();
    }
}

/*Animer la barre du chronomètre
====================================*/ 
function tempsPasse() {
    //On associe la largeur de la barre du chrono à la valeur de la variable largeurBarre
    barreChrono.style.width = `${largeurBarre}vw`;
    //On décrémente la valeur de largeurBarre par 0.1
    largeurBarre -= 0.05;
    //Si la largeur de la barre est plus grande que 0 et que le quiz est commencé...
    if (largeurBarre > 0 && questionCommence == true)
    {
        //La barre s'anime
        requestAnimationFrame(tempsPasse);
    }
    //Si la largeur de la barre de temps tombe à 0...
    if (largeurBarre <= 0)
    {
        //On appelle la fonction qui ferme le rideau
        fermerRideaux();
        //On enlève la question du tableau après que le temps soit écoulé
        questions.splice(noQuestion, 1);
        //On remet la classe clique sur la div des choix de réponse pour qu'ils ne puissent plus être cliqués
        choixDeReponses.classList.toggle("clique");
    }
}

/*Quand le quiz commence et que les questions apparaîssent
===================================================================*/
function afficherQuestions() {
    ouvrirRideaux();
    //Remet la barre de temps à 100
    largeurBarre = 96.5;
    
    //On récupère une question parmis les questions comprises dans le tableau
    let uneQuestion = questions[noQuestion];

    //On affecte le titre de la question au conteneur prévu à cet effet dans le HTML
    titre.innerText = uneQuestion.titre;

    //Le conteneur des choix de réponse est vide
    choixDeReponses.innerHTML = "";

    let unChoix;
    for (let i = 0; i < uneQuestion.choix.length; i++) {

        //Création de la balise div et affectation de sa classe .choix
        unChoix = document.createElement("div");
        unChoix.classList.add("choix");

        //On ajoute les choix de réponse en tant que texte dans les divs crées
        unChoix.innerText = uneQuestion.choix[i];

        //Affectation de l'index de chaque choix
        unChoix.indexChoix = i;

        //L'Écouteur d'évènement est placé sur la réponse choisie par le joueur
        unChoix.addEventListener('mousedown', verifierReponse);

        //Affichage des choix de réponse
        choixDeReponses.append(unChoix);
        //Pour faire apparaître l'image associée à la bonne question
        imageReference.style.backgroundImage = (`url("${uneQuestion.urlImage}")`);

        //On ajoute un écouteur d'évènement sur les nouvelles divs pour changer l'apparence du curseur 
        unChoix.addEventListener('mouseover', changerApparenceCurseur);
        unChoix.addEventListener('mouseout', changerApparenceCurseur);
    }
}

/*Fonction qui vérifie la réponse
======================================*/
function verifierReponse(event) {

    //On vérifie si le joueur choisi la bonne réponse ou non
    if (event.target.indexChoix == questions[noQuestion].bonneReponse)
    {
        //Si c'est la bonne réponse on ajoute la classe "succes" a la div contenant la réponse
        event.target.classList.add("succes");
        //Et on augmente le nombre de points
        nombreBonnesReponses++;
        //On augmente le score dans le local storage à chaque bonne réponse
        localStorage.setItem("score", nombreBonnesReponses);

        //On ajoute la classe clique pour empêcher de cliquer sur les questions pendant la vérification  
        choixDeReponses.classList.toggle("clique");
        //On enlève, du tableau questions, la questions ayant l'index équivalent à la variable noQuestion et le tableau s'ajuste
        questions.splice(noQuestion, 1);
    }
    else
    {
        //Si c'est la mauvaise réponse on ajoute la classe echec à la div choisie par le joueur
        event.target.classList.add("echec");
        //On remet la classe clique pour empêcher de cliquer sur les réponses une fois qu'un choix est fait 
        choixDeReponses.classList.toggle("clique");
        //On enlève, du tableau questions, la questions ayant l'index équivalent à la variable noQuestion et le tableau s'ajuste
        questions.splice(noQuestion, 1);
    }

    //On ajoute un écouteur d'évènement sur l'animation de bonne ou mauvaise réponse  
    event.target.addEventListener('animationend', fermerRideaux);

    //Si l'animation fini...
    if (event.target == "animationend")
    {
        //On appelle la fonction qui ferme le rideau
        fermerRideaux();
    }
}

/*Passer à la prochaine question
=====================================*/ 
 function questionSuivante() {
    //On met à jour la variable noQuestion pour qu'elle prenne en compte les questions retirées du tableau
    noQuestion = Math.floor(Math.random()*questions.length);

     //Si la quantitée de questions posées est plus petite que le nombre total de questions on passe à la prochaine 
     if (noQuestion < questions.length)
     {
        //On passe à la question suivante
         afficherQuestions();
     }
     else
     {
        //On incrémente le nouveau score au tableau des scores
        historique[historique.length-1].scores.push(nombreBonnesReponses);
        //On transforme les valeurs du tableau en string pour une future utilisation
        localStorage.setItem("historiqueQuiz", JSON.stringify(historique)); 

        afficherLaFin();
     }
 }

 /*La fin du quiz
 ==================================*/
 function afficherLaFin() {
    //On associe la variable scorePrecedent au tableau historiqueQuiz dans le localStorage
    let scorePrecedent = JSON.parse(localStorage.getItem("historiqueQuiz"));

    //On enlève la zone du quiz
    Quiz.style.display = "none";
    //Ici on change la position, l'index z et les pointers events pour laisser le 
    //le rideau une fois la page finale affichée joueur interagir par dessus
    rideauFin.style.pointerEvents = "all";
    rideauFin.style.position = "relative";
    rideauFin.style.zIndex = "-1";

    //On crée une section pour montrer les résultats du joueur
    let lesResultats = document.createElement("section");
    //On crée le bouton pour recommencer le quiz
    let boutonRecommencer = document.createElement("button.boutonRecommencer");
    //On ajoute une classe à la section
    lesResultats.classList.add("score");
    //On ajoute un icône dans le bouton
    boutonRecommencer.innerHTML= '&#8635';
    //On ajoute une classe au bouton
    boutonRecommencer.classList.add("boutonRecommencer");
    //Pour empêcher que le body ne recoive les click à la place de la section
    document.body.style.pointerEvents = "none";

    //On met dans le texte de la section du texte avec des balises <p> ainsi que le nombre de bonne réponse sauvegardées au préalable
    //On vient également chercher les scores dans la nouvelle variable scorePrecedent et l'afficher sous le score actuel
    lesResultats.innerHTML += "<p>" + `votre score est de: ${nombreBonnesReponses} <br>` + `Votre score précédent était de : ${scorePrecedent[scorePrecedent.length-2].scores[0]}` + "</p>";

    //On ajoute des écouteurs d'évènments pour savoir si la souris survole le bouton ou non
    boutonRecommencer.addEventListener('mouseover', changerApparenceCurseur);
    boutonRecommencer.addEventListener('mouseout', changerApparenceCurseur);

    //On place les deux éléments, crées plus haut, dans la page
    rideauFin.append(lesResultats);
    lesResultats.prepend(boutonRecommencer);

    //On ajoute un écoutuer d'évènement sur le bouton 
    boutonRecommencer.addEventListener('click', recommencerLeQuiz);
}

 function recommencerLeQuiz(event) {
        //On recharge la page
        location.reload();
        //On remet le score actuel à 0
        localStorage.setItem("score", 0);
 }
