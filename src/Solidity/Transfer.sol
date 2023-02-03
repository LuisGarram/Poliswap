// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Transfer {
    function transfer(address payable _to, uint256 _value) public payable {
        require(_to.send(_value), "transfer failed");
    }
}
=========================================================================================
// SPDX-License-Identifier: MIT

contract RetainFunds {
    struct Job {
        address payable client;
        address payable freelancer;
        uint256 amount;
        bool workCompleted;
    }

    mapping(bytes32 => Job) public jobs;

    function retainFunds(address payable _client, address payable _freelancer, uint256 _amount) public payable {
        require(msg.value == _amount);
        bytes32 jobId = keccak256(abi.encodePacked(_client, _freelancer, _amount, now));
        jobs[jobId] = Job(_client, _freelancer, _amount, false);
    }

    function releaseFunds(bytes32 _jobId) public {
        Job storage job = jobs[_jobId];
        require(job.workCompleted == true);
        require(msg.sender == job.client);
        job.freelancer.transfer(job.amount);
        job.workCompleted = false;
    }

    function confirmWorkCompleted(bytes32 _jobId) public {
        Job storage job = jobs[_jobId];
        require(msg.sender == job.freelancer);
        job.workCompleted = true;
    }
}

