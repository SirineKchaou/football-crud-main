<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

#[AsCommand(
    name: 'app:start',
    description: 'Start both Symfony and Angular servers',
)]
class StartCommand extends Command
{
    protected function configure(): void
    {
        $this
            ->setDescription('Start Symfony and Angular servers concurrently');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);


        $symfonyProcess = new Process(['php', 'bin/console', 'server:start']);
        $symfonyProcess->start();


        $angularProcess = new Process(['npm', 'start'], 'C:\laragon\www\football-crud-main\football');
        $angularProcess->setTimeout(0);
        $angularProcess->start();


        $io->note('Symfony server is running at: http://localhost:8000');
        $io->note('Angular server is running at: http://localhost:4200');

        $io->success('Symfony and Angular servers are running in parallel.');


        $symfonyProcess->wait();
        $angularProcess->wait();


        if (!$symfonyProcess->isSuccessful()) {
            throw new ProcessFailedException($symfonyProcess);
        }

        if (!$angularProcess->isSuccessful()) {
            throw new ProcessFailedException($angularProcess);
        }

        return Command::SUCCESS;
    }
}
