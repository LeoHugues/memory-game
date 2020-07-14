<?php

namespace App\Controller;

use App\Entity\Player;
use App\Entity\Score;
use App\Form\PlayerType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class MemoryGameController extends AbstractController
{
    /**
     * @Route("/", name="memory_game")
     */
    public function index()
    {
        return $this->render('memory_game/index.html.twig', [
            'controller_name' => 'MemoryGameController',
        ]);
    }

    /**
     * @param Request $request
     *
     * @Route("/register", name="register_form", methods={"POST", "GET"})
     * @return JsonResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function ajaxRegesterForm(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $player = new Player();
        $form = $this->createForm(PlayerType::class, $player);

        $form->handleRequest($request);
        if($form->isSubmitted() && $form->isValid()) {
            /** @var Player $player */
            $player = $form->getData();

            $em->persist($player);
            $em->flush();

            return new JsonResponse([
                'id'        => $player->getId(),
                'name'      => $player->getUsername(),
                'status'    => 'success'
            ]);
        }

        return $this->render('memory_game/register.html.twig', array('form' => $form->createView()));
    }

    /**
     * @param Player $player
     * @param Request $request
     *
     * @return JsonResponse|\Symfony\Component\HttpFoundation\Response
     * @Route("/score/{id}", name="form_save_score")
     * @ParamConverter("player", class="App\Entity\Player")
     */
    public function ajaxSaveScore(Player $player, Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        // Création du nouveau score
        $score = new Score();
        $score->setTime($request->get('time'));
        $score->setPlayer($player);

        // Persistance en BDD
        $em->persist($score);
        $em->flush();

        return new JsonResponse(['status' => 'succes']);
    }

    /**
     * @param SerializerInterface $serializer
     * @param Request $request
     *
     * @return JsonResponse|\Symfony\Component\HttpFoundation\Response
     * @Route("/scores", name="get_scores")
     */
    public function ajaxGetRanking(SerializerInterface $serializer, Request $request)
    {
        $em         = $this->getDoctrine()->getManager();
        $scores     = $em->getRepository('App\Entity\Score')->findBy([], ['time' => 'asc'],5);
        $jsonScores = $serializer->serialize($scores, 'json', ['groups' => 'ajaxScore']);

        return new JsonResponse($jsonScores);
    }
}
