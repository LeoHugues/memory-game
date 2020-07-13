<?php

namespace App\Entity;

use App\Repository\ScoreRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ScoreRepository::class)
 */
class Score
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     *
     * @Groups("ajaxScore")
     */
    private $time;

    /**
     * @ORM\Column(type="datetime")
     *
     * @Groups("ajaxScore")
     */
    private $date;

    /**
     * @ORM\ManyToOne(targetEntity=Player::class, inversedBy="scores")
     *
     * @Groups("ajaxScore")
     */
    protected $player;

    public function __construct()
    {
        $this->date = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return integer
     */
    public function getTime()
    {
        return $this->time;
    }

    /**
     * @param integer $time
     */
    public function setTime($time): void
    {
        $this->time = $time;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getPlayer()
    {
        return $this->player;
    }

    /**
     * @param mixed $player
     */
    public function setPlayer($player): void
    {
        $this->player = $player;
    }
}
